function GameRepo() {
    this.saveScore = function (level, score) {
        if (score > this.getScore(level))
            localStorage.setItem(`level-${level}`, score);
    }
    this.getScore = function (level) {
        let s = localStorage.getItem(`level-${level}`);
        if (s) return parseInt(s);
        return 0;
    }
    this.setMaxLevel = function (level) {
        if (level > this.getMaxLevel())
            localStorage.setItem('maxLevel', level);
    }
    this.getMaxLevel = function () {
        let ml = localStorage.getItem('maxLevel');
        if (ml) return parseInt(ml);
        return 1;
    }
}

function ConfigRepo() {
    this.saveLang = function (lang) {
        localStorage.setItem('lang', lang);
    }
    this.getLang = function () {
        let lang = localStorage.getItem('lang');
        if (lang) return parseInt(lang);
        return 0;
    }
}