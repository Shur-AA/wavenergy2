var globalGap = 5;
var globalFont = "10pt Arial";
var globalTextColor = "black";
var globalCaptionFont = "12pt Arial";
var globalCaptionColor = "black";
var globalBorder = ""; //'1px solid black'; //""; //"5px solid rgba(0,0,0,0)"; //'1px solid black'; //""

function tablesInit(columns, rows, id) {
    //rows - array of rows number of every table
    var body = document.getElementById(id); //document.body,

    for (j = 0; j < columns; j++) {
        var tbl = document.createElement('table');

        //it is nessesary not to have table for all screen
        tbl.style = "table-layout:fixed;"
        tbl.style.border = globalBorder;
        tbl.align = "left";

        for (var i = 0; i < rows[j]; i++) {
            var tr = tbl.insertRow();
            var td = tr.insertCell();
            td.id = "td" + j + i;
            td.style.border = globalBorder;
        }
        body.appendChild(tbl);
    }
}

function createTable(id, rows, cols, is_split, align) {
    var body = document.getElementById(id);
    var tbl = document.createElement('table');

    //it is nessesary not to have table for all screen
    tbl.style = "table-layout:fixed;"
    tbl.style.border = globalBorder;
    var cols = cols || 2;
    for (j = 0; j < rows; j++) {
        var tr = tbl.insertRow();
        for (var i = 0; i < cols; i++) {
            var td = tr.insertCell();
            if (is_split) {
                td.id = id + i;
                td.style = "vertical-align: top;"; //to have table in top of the cell
            } else {
                td.style = "vertical-align: center;"; //to have text in cell in center
                if (align) {
                    td.align = align;
                }
            }
            td.style.border = globalBorder;
        }
    }
    body.appendChild(tbl);
    return tbl;
}

function createInternalTable(extrenalcol, externalrow, rows, cols, is_split, inside_col, align) {
    var tdID = "td" + extrenalcol + externalrow;
    if ((inside_col != undefined) && (inside_col !== false)) {
        tdID = tdID + inside_col;
    }
    var tbl = createTable(tdID, rows, cols, is_split, align); //tableCreate(cols, rows, tdID);
    return tbl;
}

function getCell(table, r, c) {
    var cell = table.rows[r].cells;
    return cell[c];
}

function insertCanvas(td) {
    var canv = document.createElement('canvas');
    td.appendChild(canv);
    return canv;
}

//rectangles (изолинейная шкала)
function layeredColoring(column, row, colors, strokecolor, size, is_vertical, description, textfont, textcolor, txtGap, xgap, ygap, caption, captionfont, captioncolor, inside_col) {

    xgap = xgap || globalGap;
    ygap = ygap || globalGap;
    canvasSize = getWH(colors.length, size, is_vertical);
    var mytable = createInternalTable(column, row, 1, 1, false, inside_col);
    var ctx = getCtx(mytable, 0, 0, canvasSize.w + xgap * 2, canvasSize.h + ygap * 2);

    var x0 = xgap;
    var y0 = ygap;
    var x = x0;
    var y = y0;
    var w = size[0];
    var h = size[1];

    // rectangles drawing
    for (i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = strokecolor || "grey";
        ctx.strokeRect(x, y, w, h);
        if (!is_vertical) {
            x = x + w;
        }
        else {
            y = y + h;
        }
    }

    //text drawing
    var startCoord, dCoord, constCoordDescr, coordDescr;
    if (is_vertical) {
        startCoord = y0;
        dCoord = h;
        txtGap = txtGap || w + w * 0.1
        constCoordDescr = x0 + txtGap;
    }
    else {
        startCoord = x0;
        dCoord = w;
        txtGap = txtGap || h + h * 0.7
        constCoordDescr = y0 + txtGap;
    }

    //start coordinate
    switch (description.length) {
        case colors.length - 1:
            coordDescr = startCoord + dCoord;
            break;
        case colors.length + 1:
            coordDescr = startCoord;
            break;
        case colors.length:
            coordDescr = startCoord + dCoord / 2.0;
            break;
        default:
            alert('Incorrect');
    }

    if (is_vertical) {
        textDrawing(ctx, constCoordDescr, coordDescr, 0, dCoord, "start", description, textfont, textcolor);
    }
    else {
        textDrawing(ctx, coordDescr, constCoordDescr, dCoord, 0, "center", description, textfont, textcolor);
    }

    setCaption(mytable, captionfont, captioncolor, caption);
}

function drawRings(ctx, x, y, size, color) {
    if (Array.isArray(size)) {
        for (j = 0; j < size.length; j++) {
            ctx.beginPath();
            ctx.arc(x, y, size[j], 0, Math.PI * 2);
            var curcolor = (Array.isArray(color) ? color[j] : color || "black")
            ctx.fillStyle = curcolor;
            ctx.fill();
            ctx.closePath();
        }
    }
    else {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        var tst = color[j] || color || black;
        ctx.fillStyle = (Array.isArray(color) ? color[j] : color || "black");
        ctx.fill();
        ctx.closePath();
    }
}

function getSizeArray(size) {
    var arr = size.slice();
    for (i = 0; i < arr.length; i++) {
        if (arr[i].length != undefined) {
            arr[i] = Math.max.apply(null, arr[i]);
        }
    }
    return arr;
}

function setText(mytable, r, c, description, textfont, textcolor, textwidth) {
    var mycell = getCell(mytable, r, c);
    if (textwidth != undefined) {
        var w = getTextWidth(description);
        mycell.width = textwidth || w || "100px";
    }
    var currentfont = Array.isArray(textfont) ? textfont[i] : textfont;
    mycell.style.font = currentfont || globalFont;
    mycell.style.color = textcolor || globalTextColor;
    mycell.innerHTML = description;
}

function getCtx(mytable, i, column, w, h) {
    var mycell = getCell(mytable, i, column);
    var canv = insertCanvas(mycell);
    canv.width = w;
    canv.height = h;
    var ctx = canv.getContext('2d');
    return ctx;
}

//значки и картодиаграммы
function circles(column, row, size, is_vertical, color, description, textfont, textcolor, textwidth, caption, captionfont, captioncolor, inside_col) {
    //column & row - coordinates of cell of external table, where will be our circles
    //inside_col is a column number of internal table in the external table
    //create internal table with description.length rows
    // if there is only one color - set it in one array: "yellow"
    // if there only one size with difficult structure: [[...]]
    if (is_vertical) {
        var mytable = createInternalTable(column, row, description.length, 2, false, inside_col);
    } else {
        var mytable = createInternalTable(column, row, 2, description.length, false, inside_col, "center");
    }

    var currentsize;
    var maxR;
    if (Array.isArray(size)) {
        var sizeArray = getSizeArray(size);
        maxR = Math.max.apply(null, sizeArray);
        if ((size.length == 1) && (Array.isArray(size[0]))) {
            currentsize = size[0];
        }
    } else {
        currentsize = size;
        maxR = size;
    }

    //coordinate of circles center
    var x0 = maxR + globalGap;

    //if there is a only one color for all 
    var currentcolor;
    if (Array.isArray(color)) {
        if (color.length == 1) {
            currentcolor = color[0];
        }
    } else {
        currentcolor = color;
    }

    if (Array.isArray(description)) {
        for (i = 0; i < description.length; i++) {
            if (is_vertical) {
                var ctx = getCtx(mytable, i, 0, x0 * 2, x0 * 2);
                setText(mytable, i, 1, description[i], textfont, textcolor, textwidth);
            } else {
                var ctx = getCtx(mytable, 0, i, x0 * 2, x0 * 2);
                setText(mytable, 1, i, description[i], textfont, textcolor, textwidth);
            }

            ctx.beginPath();
            if (currentcolor) {
                color[i] = currentcolor;
            }
            var curcolor = currentcolor ? currentcolor : color[i];
            var cursize = currentsize || size[i];
            drawRings(ctx, x0, x0, cursize, curcolor);
            ctx.closePath();
        }
    }
    else {
        var ctx = getCtx(mytable, 0, 0, x0 * 2, x0 * 2);
        drawRings(ctx, x0, x0, size, currentcolor);
        setText(mytable, 0, 1, description, textfont, textcolor, textwidth);
    }
    setCaption(mytable, captionfont, captioncolor, caption);
}

function setCaption(mytable, font, color, text) {
    if (text) {
        var cap = mytable.createCaption();
        cap.style.font = font || globalCaptionFont || globalFont;
        cap.style.color = color || globalCaptionColor || globalTextColor;
        cap.innerHTML = text;
    }
}

function drawText(ctx, x, y, align, description, currentfont, textcolor) {
    ctx.fillStyle = textcolor || globalTextColor;
    ctx.font = currentfont || globalFont;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(description, x, y);
}

function textDrawing(ctx, x, y, dx, dy, align, description, textfont, textcolor) {
    for (i = 0; i < description.length; i++) {
        var currentfont = Array.isArray(textfont) ? textfont[i] : textfont;
        drawText(ctx, x, y, align, description[i], currentfont, textcolor);
        x = x + dx;
        y = y + dy;
    }
}

function drawDottedLine(ctx, length, x, y, width, linecolor, pattern) {
    if (pattern.length != undefined) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = linecolor;
        var lastX = x + length;
        ctx.moveTo(x, y);
        while (x < lastX) {
            for (k = 0; k < pattern.length; k += 2) {
                x = x + pattern[k];
                if (x > lastX) {
                    x = lastX;
                    ctx.lineTo(x, y);
                    break;
                }
                ctx.lineTo(x, y);
                x = x + pattern[k + 1];
                ctx.moveTo(x, y);
            }
        };
        ctx.stroke();
    }
}

function drawArrow(ctx, x, y, arrowwidth, arrowcolor) {
    ctx.beginPath();
    ctx.fillStyle = arrowcolor;
    ctx.moveTo(x, y + arrowwidth / 2.0);
    ctx.lineTo(x, y - arrowwidth / 2.0);
    x = x + arrowwidth;
    ctx.lineTo(x, y);
    ctx.fill();
}

function getWH(amount, size, is_vertical, gap, description) {
    // for layeredColoring
    // size[0] - w, size[1] - h of rectangle
    var w, h;
    var gap = gap || globalGap * 2;

    if (is_vertical) {
        h = size[1] * amount + gap;
        w = size[0] * 2 + gap;
    }
    else {
        h = size[1] * 2 + gap;
        w = size[0] * amount + gap;
    }
    return {
        w: w,
        h: h
    }
}

function getTextWidth(description) {
    //check digit in the last string
    var l = 0; //text length
    if (Array.isArray(description)) {
        for (i = 0; i < description.length; i++) {
            if (description[i].length > l) {
                l = description[i].length;
            }
        }
    }
    else {
        l = description.length;
    }
    return l * 8;
}

module.exports = {
    tablesInit,
    layeredColoring
}