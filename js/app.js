// ============================================
// 2. Импорты
// ============================================
const http = require('http');
const { Pool } = require('pg'); // Используем Pool вместо Client

// ============================================
// 3. Настройка пула соединений (оптимизация!)
// ============================================
const pool = new Pool({
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT) || 5432,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    max: 10, // Максимум соединений в пуле
    idleTimeoutMillis: 30000, // Закрывать неактивные через 30 сек
    connectionTimeoutMillis: 5000, // Таймаут подключения
});

// Логирование событий пула
pool.on('connect', () => {
    console.log(`📊 Соединение с БД установлено. Всего: ${pool.totalCount}`);
});

pool.on('remove', () => {
    console.log(`📊 Соединение закрыто. Осталось: ${pool.totalCount}`);
});

pool.on('error', (err) => {
    console.error('❌ Ошибка пула БД:', err.message);
});

// ============================================
// 4. Запросы
// ============================================

const rosedata = `
        SELECT "vls" 
        FROM blackchart 
        WHERE "latitude" = $1 
            AND "longitude" = $2 
            AND "season" = 'wind'
    `

const freqdata = `
        SELECT "vls", "season" 
        FROM blackchart 
        WHERE "latitude" = $1 
            AND "longitude" = $2 
            AND "height" = $3
    `

// ============================================
// 5. Обработка запросов (оптимизировано)
// ============================================
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let body = '';

    try {
        // Сбор данных с проверкой размера
        req.on('data', chunk => {
            if (body.length > 1e6) { // 1MB лимит
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Payload too large' }));
                req.destroy();
                return;
            }
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                // Проверка наличия данных
                if (!body) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No data received' }));
                    return;
                }

                const data = JSON.parse(body);
                console.log('📨 Запрос:', data.type || 'unknown');

                // Формирование запроса
                let query
                let params

                switch (data.type) {
                    case 'rose':
                        query = rosedata;
                        params = [data.lat, data.lon];
                        break;

                    case 'freq':
                        query = freqdata;
                        params = [data.lat, data.lon, data.height];
                        break;

                    default:
                        query = 'SELECT 1 as test';
                        params = [];
                }

                console.log('🔍 SQL:', query);
                console.log('📊 Параметры:', params);

                // Выполнение запроса через Pool
                console.log()
                const result = await pool.query(query, params);



                console.log(`✅ Успешно: ${result.rows.length} строк`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows));

            } catch (error) {
                console.error('❌ Ошибка обработки:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }));
            }
        });

    } catch (error) {
        console.error('❌ Ошибка сервера:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
});

// ============================================
// 6. Запуск сервера
// ============================================
const PORT = parseInt(process.env.BACKEND_PORT) || 9696;
const HOST = process.env.BACKEND_HOST || 'localhost';

server.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log(`✅ Server running at http://${HOST}:${PORT}/`);
    console.log(`📊 Пул БД: max=${pool.options.max} connections`);
    console.log(`📡 Режим: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
});

// ============================================
// 7. Graceful shutdown (корректное завершение)
// ============================================
const shutdown = async (signal) => {
    console.log(`\n🛑 Получен сигнал ${signal}, завершаем работу...`);

    server.close(async () => {
        console.log('🔌 HTTP сервер остановлен');
        try {
            await pool.end();
            console.log('✅ Все соединения с БД закрыты');
            process.exit(0);
        } catch (err) {
            console.error('❌ Ошибка при закрытии соединений:', err);
            process.exit(1);
        }
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Обработка необработанных ошибок
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
});