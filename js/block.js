var global = this;

var maxlen = 400;
var eachlen;

function Board(x, y, ratio = 1) {
    this.score = parseInt((x * y + 80) * ratio);
    this.x = x;
    this.y = y;
    eachlen = maxlen / Math.max(this.x, this.y);
    for (let row of global.document.getElementsByClassName("row")) {
        row.style = `width: ${eachlen * this.y}px; height: ${eachlen * 1.28}px; font-size: ${eachlen / 2}px;`
    }
    for (let block of global.document.getElementsByClassName("block")) {
        block.style = `width: ${eachlen}px; height: ${eachlen * 1.28}px; font-size: ${eachlen / 2}px;`
    }
    this.toolBlocks = [[], [], []];
    this.matrix = [];
    this.moveBugFuncs = [];
    this.moveYeFuncs = [];
    for (let i = 0; i < x; ++i) {
        let row = [];
        for (let j = 0; j < y; ++j) {
            let block = new Block({ type: 'blank' }, i, j, this);
            block.refreshCSS('background: #221');
            row.push(block);
        }
        this.matrix.push(row);
    }
    this.yeCount = function () {
        return this.toolBlocks[0].length;
    }
    this.foundCount = function () {
        let c = 0;
        for (let block of this.toolBlocks[0]) {
            if (block.getVisible()) c++;
        }
        return c;
    }
    this.set = function (i, j, emoji, cost = 0) {
        let target = this.matrix[i][j];
        let prevtype = target.type;
        if (prevtype !== 'tool')
            this.score -= cost
        this.reset(i, j);
        target.type = 'tool'
        target.emoji = emoji;
        if (emoji === '👴') this.toolBlocks[0].push(target);
        if (emoji === '💡') this.toolBlocks[1].push(target);
        if (emoji === '🔮') this.toolBlocks[2].push(target);
    }
    this.reset = function (i, j) {
        if (!this.isValid(i, j)) return;
        let target = this.matrix[i][j];
        if (target.emoji === '👴') this.toolBlocks[0].splice(this.toolBlocks[0].indexOf(target), 1);
        if (target.emoji === '💡') this.toolBlocks[1].splice(this.toolBlocks[1].indexOf(target), 1);
        if (target.emoji === '🔮') this.toolBlocks[1].splice(this.toolBlocks[2].indexOf(target), 1);
        target.type = 'blank';
        target.emoji = '';
    }
    this.isValid = function (i, j) {
        return i >= 0 && i < this.x && j >= 0 && j < this.y;
    }
    this.blockNot = function (i, j, emoji) {
        return this.matrix[i] && this.matrix[i][j].emoji !== emoji;
    }
    this.switchDirect = function (direct) {
        switch (direct) {
            case 0: res = [ix + 1, iy, direct];
            case 1: res = [ix - 1, iy, direct];
            case 2: res = [ix, iy + 1, direct];
            case 3: res = [ix, iy - 1, direct];
            default: res = [ix, iy, direct];
        }
    }
    // 移动AI: 虫近灯, 爷远灯
    this.nextStep = function (ix, iy, direct, mode = 'bug') {
        let dist = -1, res = null;
        switch (direct) {
            case 0: res = [ix + 1, iy, direct];
                break;
            case 1: res = [ix - 1, iy, direct];
                break;
            case 2: res = [ix, iy + 1, direct];
                break;
            case 3: res = [ix, iy - 1, direct];
                break;
            default: res = [ix, iy, direct];
                break;
        }
        for (let block of this.toolBlocks[1]) {
            let dx = block.i - ix;
            let dy = block.j - iy;
            if (block.i === ix) {
                if (mode === 'bug') {
                    if (dy > 0) {
                        direct = 2;
                    } else {
                        direct = 3;
                    }
                } else if (mode === 'ye') {
                    if (dy > 0) {
                        if (ix >= 0 && ix < this.x) {
                            direct = 3;
                            continue;
                        }
                    } else {
                        if (ix >= 0 && ix < this.x) {
                            direct = 2;
                            continue;
                        }
                    }
                    if (dx > 0) {
                        direct = 0;
                    } else {
                        direct = 1;
                    }
                }
            } else if (block.j == iy) {
                if (mode === 'bug') {
                    if (dx > 0) {
                        direct = 0;
                    } else {
                        direct = 1;
                    }
                } else if (mode === 'ye') {
                    if (dx > 0) {
                        if (iy >= 0 && iy < this.y) {
                            direct = 1;
                            continue;
                        }
                    } else {
                        if (iy >= 0 && iy < this.y) {
                            direct = 0;
                            continue;
                        }
                    }
                    if (dy > 0) {
                        direct = 2;
                    } else {
                        direct = 3;
                    }
                }
            }
        }
        if (!this.isValid(res[0], res[1]) || !this.blockNot(res[0], res[1], '👴') || direct === -1) {
            if (this.toolBlocks[1].length !== 0)
                for (let block of this.toolBlocks[1]) {
                    let dx = block.i - ix;
                    let dy = block.j - iy;
                    let d = Math.min(Math.abs(dx), Math.abs(dy));
                    if (dist === -1 || d < dist) {
                        dist = d;
                        if (d === dx && this.blockNot()) {
                            direct = 0;
                        } else if (d === -dx && this.blockNot()) {
                            direct = 1;
                        } else if (d === dy && this.blockNot()) {
                            direct = 2;
                        } else if (d === -dy && this.blockNot()) {
                            direct = 3;
                        }
                    }
                }
        }
        switch (direct) {
            case 0: res = [ix + 1, iy, direct];
                break;
            case 1: res = [ix - 1, iy, direct];
                break;
            case 2: res = [ix, iy + 1, direct];
                break;
            case 3: res = [ix, iy - 1, direct];
                break;
            default: res = [ix, iy, direct];
                break;
        }
        if (this.toolBlocks[1].length === 0) direct = -1;
        if ((!this.isValid(res[0], res[1]) || !this.blockNot(res[0], res[1], '👴')) && direct !== -1) {
            switch (direct) {
                case 0: direct = 1;
                    break;
                case 1: direct = 0;
                    break;
                case 2: direct = 3;
                    break;
                case 3: direct = 2;
                    break;
            }
        }
        switch (direct) {
            case 0: res = [ix + 1, iy, direct];
                break;
            case 1: res = [ix - 1, iy, direct];
                break;
            case 2: res = [ix, iy + 1, direct];
                break;
            case 3: res = [ix, iy - 1, direct];
                break;
            default: res = [ix, iy, direct];
                break;
        }
        return res;
    }
    this.randomNext = function (ix, iy) {
        let resList = [
            [ix + 1, iy],
            [ix - 1, iy],
            [ix, iy + 1],
            [ix, iy - 1]
        ];
        let d = randInt(0, 4);
        while (!this.isValid(resList[d][0], resList[d][1]) || !this.blockNot(resList[d][0], resList[d][1], '👴') ||  !this.blockNot(resList[d][0], resList[d][1], '💡')) {
            d = randInt(0, 4);
        }
        return resList[d];
    }
    // 设置可移动的🐛
    this.setBug = function () {
        var ix = randInt(0, x), iy = randInt(0, y), direct = 0;
        // this.set(ix, iy, '🐛');
        var px = -1, py = -1;
        this.moveBugFuncs.push(() => {
            [ix, iy, direct] = this.nextStep(ix, iy, direct, 'bug');
            if (px !== -1 && py !== -1) this.reset(px, py);
            this.set(ix, iy, '🐛');
            px = ix, py = iy;
        });
    }
    // 设置可移动的👴
    this.setYe = function () {
        var ix = randInt(0, x), iy = randInt(0, y);
        this.set(ix, iy, '👴');
        this.moveYeFuncs.push(() => {
            let flag = this.matrix[ix][iy].creditFlag;
            this.reset(ix, iy);
            [ix, iy] = this.randomNext(ix, iy);
            this.set(ix, iy, '👴');
            this.matrix[ix][iy].creditFlag = flag;
        });
    }
    this.moveBug = function () {
        for (let func of this.moveBugFuncs) {
            func();
        }
    }
    this.moveYe = function () {
        for (let func of this.moveYeFuncs) {
            func();
        }
    }
}

function Block(info, i, j, board) {
    this.mx = board.x;
    this.my = board.y;
    this.toolBlocks = board.toolBlocks;
    this.type = info.type;
    this.emoji = info.emoji;
    this.forceVisible = false;
    this.i = i;
    this.j = j;
    this.creditFlag = 1;
    this.closest = function () {
        let min = -1;
        for (let block of this.toolBlocks[0]) {
            let d = Math.abs(block.i - this.i) + Math.abs(block.j - this.j);
            if (min == -1 || d < min) {
                min = d;
            }
        }
        return min;
    }
    this.getVisible = function () {
        if (this.forceVisible) return true;
        if (this.checkMagic()) return true;
        for (let block of this.toolBlocks[1]) {
            let d = Math.abs(block.i - this.i) + Math.abs(block.j - this.j);
            if (d <= 1) {
                if (this.emoji === '👴' && this.creditFlag) {
                    board.score += 25;
                    this.creditFlag = false;
                }
                return true;
            }
        }
        return false;
    }
    this.checkMagic = function () {
        for (let block of this.toolBlocks[2]) {
            let d = Math.abs(block.i - this.i) + Math.abs(block.j - this.j);
            if (d <= 2) {
                this.type = 'magic';
                if (this.emoji === '👴' && this.creditFlag) {
                    board.score += 25;
                    this.creditFlag = false;
                }
                if (d !== 0 && this.emoji !== '👴') this.emoji = ''
                return true;
            }
        }
        return false;
    }
    this.refreshCSS = function (style) {
        let target = document.getElementById(this.i + '-' + this.j);
        if (target)
            target.style = `width: ${eachlen}px; height: ${eachlen}px; font-size: ${eachlen / 2}px;` + style;
    }
    this.getDisplay = function () {
        if (document.getElementById(this.i + '-' + this.j)) {
            if (!this.getVisible()) {
                this.refreshCSS("background: #221;");
                return '';
            }
            if (this.type === 'tool') {
                this.refreshCSS(`background: rgb(${255 - this.closest() / (this.mx + this.my) * 255}, ${255 - this.closest() / (this.mx + this.my) * 255}, 0);`);
                return this.emoji;
            } else if (this.type === 'blank') {
                this.refreshCSS(`background: rgb(${255 - this.closest() / (this.mx + this.my) * 255}, ${255 - this.closest() / (this.mx + this.my) * 255}, 0);`);
                return '🌳';
            } else if (this.type === 'magic') {
                this.refreshCSS("background: #f0f;");
                if (this.emoji === '')
                    return this.closest();
                return this.emoji;
            }
        } else {
            setTimeout(() => {
                this.getDisplay();
            })
        }
    };
}