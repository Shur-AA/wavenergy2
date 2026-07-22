// ============================================
// 1. Загрузка переменных окружения
// ============================================
require('dotenv').config({ path: '../.env'});

// ============================================
// 2. Импорты
// ============================================
const http = require('http');
const { Pool } = require('pg'); // Используем Pool вместо Client
const querystring = require('querystring');

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
// 4. Вспомогательные функции (без изменений)
// ============================================
function reformatDatetime(date, time) {
    if (time.length === 1) { time = '0' + time; }
    return `'${date.slice(6, 10)}-${date.slice(3, 5)}-${date.slice(0, 2)} ${time}:00:00'`;
}

function fillQtable(start, finish, ind) {
    return `
        SELECT 
            round(CAST(float8(avg("Hsig")) as numeric), 2) as avg_hsig,
            round(CAST(float8(avg("Period")) as numeric), 2) as avg_period,
            round(CAST(float8(avg("Wlen")) as numeric), 2) as avg_wlen,
            round(CAST(float8(avg("Energy")) as numeric), 2) as avg_energy,
            round(CAST(float8(max("Hsig")) as numeric), 2) as max_hsig,
            round(CAST(float8(max("Period")) as numeric), 2) as max_period,
            round(CAST(float8(max("Wlen")) as numeric), 2) as max_wlen,
            round(CAST(float8(max("Energy")) as numeric), 2) as max_energy,
            round(CAST(float8(min("Hsig")) as numeric), 2) as min_hsig,
            round(CAST(float8(min("Period")) as numeric), 2) as min_period,
            round(CAST(float8(min("Wlen")) as numeric), 2) as min_wlen,
            round(CAST(float8(min("Energy")) as numeric), 2) as min_energy,
            round(CAST(float8(percentile_disc(0.5) within group (order by "Hsig")) as numeric), 2) as med_hsig,
            round(CAST(float8(percentile_disc(0.5) within group (order by "Period")) as numeric), 2) as med_period,
            round(CAST(float8(percentile_disc(0.5) within group (order by "Wlen")) as numeric), 2) as med_wlen,
            round(CAST(float8(percentile_disc(0.5) within group (order by "Energy")) as numeric), 2) as med_energy,
            round(CAST(float8(stddev("Hsig")) as numeric), 2) as std_hsig,
            round(CAST(float8(stddev("Period")) as numeric), 2) as std_period,
            round(CAST(float8(stddev("Wlen")) as numeric), 2) as std_wlen,
            round(CAST(float8(stddev("Energy")) as numeric), 2) as std_energy
        FROM public.chdata 
        WHERE "Hsig" >= 0 
            AND "Period" >= 0 
            AND "Wlen" >= 0 
            AND "Energy" >= 0 
            AND "Index" = $1
            AND "Datetime" BETWEEN $2 AND $3
    `;
}

function fillSupplyRow(field, operator, val, ind) {
    const opMap = {
        'less': '<',
        'greater': '>'
    };
    const op = opMap[operator] || '>';
    
    return `
        SELECT 
            round(CAST(CAST(part as float)*100/CAST(total as float) as numeric), 1) as supply 
        FROM (
            SELECT 
                count("${field}") as part,
                (SELECT count("${field}") FROM chdata WHERE "Index" = $1) as total 
            FROM chdata 
            WHERE "${field}" ${op} $2 
                AND "Index" = $1
        ) as temporal
    `;
}

function fillFullSupply(p, en, wl, hs, ind) {
    return `
        SELECT 
            round(CAST(CAST(ppart as float)*100/CAST(total as float) as numeric), 1) as supper,
            round(CAST(CAST(hsigp as float)*100/CAST(total as float) as numeric), 1) as suphsig,
            round(CAST(CAST(enerp as float)*100/CAST(total as float) as numeric), 1) as supenerg,
            round(CAST(CAST(wlenp as float)*100/CAST(total as float) as numeric), 1) as supwlen
        FROM (
            SELECT 
                count("Period") as ppart,
                (SELECT count("Period") FROM chdata WHERE "Index" = $1) as total,
                (SELECT count("Hsig") FROM chdata WHERE "Hsig" > $2 AND "Index" = $1) as hsigp,
                (SELECT count("Energy") FROM chdata WHERE "Energy" > $3 AND "Index" = $1) as enerp,
                (SELECT count("Wlen") FROM chdata WHERE "Wlen" > $4 AND "Index" = $1) as wlenp
            FROM chdata 
            WHERE "Period" > $5 
                AND "Index" = $1
        ) as temporal
    `;
}

function rosedata(lat, lon) {
    return `
        SELECT "vls" 
        FROM blackchart 
        WHERE "latitude" = $1 
            AND "longitude" = $2 
            AND "season" = 'wind'
    `;
}

function freqdata(lat, lon, ht) {
    return `
        SELECT "vls", "season" 
        FROM blackchart 
        WHERE "latitude" = $1 
            AND "longitude" = $2 
            AND "height" = $3
    `;
}

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
                let query, params = [];

                switch (data.type) {
                    case 'maintbl':
                        query = fillQtable(
                            reformatDatetime(data.startdate, data.starthour),
                            reformatDatetime(data.enddate, data.endhour),
                            data.pindex
                        );
                        params = [data.pindex, 
                            reformatDatetime(data.startdate, data.starthour),
                            reformatDatetime(data.enddate, data.endhour)
                        ];
                        break;

                    case 'supall':
                        query = fillFullSupply(
                            data.period, data.energy, data.wlen, data.hsig, data.pindex
                        );
                        params = [data.pindex, data.hsig, data.energy, data.wlen, data.period];
                        break;

                    case 'supperiod':
                        query = fillSupplyRow('Period', data.operator, data.period_in, data.pindex);
                        params = [data.pindex, data.period_in];
                        break;

                    case 'supenergy':
                        query = fillSupplyRow('Energy', data.operator, data.energy_in, data.pindex);
                        params = [data.pindex, data.energy_in];
                        break;

                    case 'suplen':
                        query = fillSupplyRow('Wlen', data.operator, data.wlen_in, data.pindex);
                        params = [data.pindex, data.wlen_in];
                        break;

                    case 'supsig':
                        query = fillSupplyRow('Hsig', data.operator, data.hsig_in, data.pindex);
                        params = [data.pindex, data.hsig_in];
                        break;

                    case 'rose':
                        query = rosedata(data.lat, data.lon);
                        params = [data.lat, data.lon];
                        break;

                    case 'freq':
                        query = freqdata(data.lat, data.lon, data.height);
                        params = [data.lat, data.lon, data.height];
                        break;

                    default:
                        query = 'SELECT 1 as test';
                        params = [];
                }

                console.log('🔍 SQL:', query);
                console.log('📊 Параметры:', params);

                // Выполнение запроса через Pool
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