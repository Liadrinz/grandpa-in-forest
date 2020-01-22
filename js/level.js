function Level(x, y, bug, ye, toolInfo, ratio = 1, yeMove = false) {
    this.x = x;
    this.y = y;
    this.bug = bug;
    this.ye = ye;
    this.toolInfo = toolInfo;
    this.getBoard = function () {
        let board = new Board(this.x, this.y, ratio);
        let t = this.bug;
        let yc = this.ye;
        while (t--) {
            board.setBug();
        }
        while (board.yeCount() < yc) {
            if (!yeMove)
                board.set(randInt(0, x), randInt(0, y), '👴');
            else board.setYe();
        }
        return board;
    }
}
