export default class Game {
    constructor(data, health = 40, round = 1, level = 1, coins = 3, phase="Recruit") {
        this.types = ['Fire', 'Water', 'Grass'];
        this.data = data;
        this.health = health;
        this.round = round;
        this.level = level;
        this.coins = coins;
        this.phase = phase;
        this.my_board = [];
        this.buy_board = [];
    }

    returnAvailableMinions() {
        var available = [];
        this.types.forEach((e) => {
            for (let i = 0; i < this.data[e].length; i++) {
                var temp = this.data[e][i]
                if (temp.lvl <= this.level) {
                    available.push(temp);
                }
            }
        });
        return available;
    }

    generateRandomBoard(size = 7) {
        var pool = this.returnAvailableMinions()
        var board_Row = []
        for (let i = 0; i < size; i++) {
            board_Row.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return board_Row
    }

    resetBuyBoard(size = Math.min(this.level + 2, 7)) {
        this.buy_board = this.generateRandomBoard(size)
    }

    refreshButton() {
        if (this.coins >= 1) {
            this.resetBuyBoard();
            this.coins -= 1
        } else {
            alert("This costs 1 coin, you don't have enough coins")
        }
    }

    levelUp() {
        if (this.level < 7) {
            if (this.coins >= 4) {
                this.level += 1
                this.coins -= 4
            } else {
                alert("This costs 4 coins, you don't have enough coins")
            }
        } else {
            alert("The maximum level is 7")
        }
    }

    //
    purchase(name) {
        if (true) {

        }
    }

    startGame() {
        this.resetBuyBoard()
        this.my_board = this.generateRandomBoard(1)
    }
}

export const clearPreviousDom = () => {
    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
    for (let i = ($('.health-bar').length - 1); i >= 0; i--) { $('.health-bar')[i].remove();}
    for (let i = ($('.coin-img').length - 1); i >= 0; i--) { $('.coin-img')[i].remove();}
}

export const resestDomBoard = (game) => {
    var healthBar = `<div class="health-bar">|</div>`
    var coin = `<img class="coin-img" src="../static/images/other/Coin_website.png" height="10%" width="100%"/>`

    clearPreviousDom()

    if (game.coins <= 0) {
        $('#refresh-recruit')[0].disabled = true;
    }

    $('#take-action')[0].disabled = true;

    if (game.level < 7) {
        $('#Level')[0].innerHTML = `Level: ${game.level} <button id="lvl-up" style="color: black; height: 100%;"> Level Up </button>`
    } else {
        $('#Level')[0].innerHTML = `Level: ${game.level}`
    }
    $('#health-helper')[0].innerHTML = `${game.health}`;
    for (let i = 0; i < game.health; i++) { $('#hpBar').append(healthBar); }
    for (let i = 0; i < game.coins; i++) { $('#coins').append(coin); }

    for (let i = 0; i < game.buy_board.length; i++) {
        $('#top-board').append(`<img class="card-img buyable" id="" src="${game.buy_board[i].img}" 
        alt="${game.buy_board[i].name}: attack ${game.buy_board[i].atk}, health ${game.buy_board[i].health}" height="70%" width="13%">`)
    }

    for (let i = 0; i < game.my_board.length; i++) {
        $('#bottom-board').append(`<img class="card-img sellable" src="${game.my_board[i].img}" 
        alt="${game.my_board[i].name}: attack ${game.my_board[i].atk}, health ${game.my_board[i].health}" height="70%" width="13%">`)
    }

}

export const refreshRecruit = (event) => {
    var game = event.data.game;

    game.refreshButton();
    resestDomBoard(game);
}

export const levelUpHandler = (event) => {
    var game = event.data.game

    game.levelUp()
    resestDomBoard(game)
}

export const clearBorders = (exclude = null) => {
    for (let i = ($('.buyable').length - 1); i >= 0; i--) {
        if ($($('.buyable')[i]).css('border-style') == 'solid') {
            $($('.buyable')[i]).css('border', '');
        }
    }
    for (let i = ($('.sellable').length - 1); i >= 0; i--) {
        if ($($('.sellable')[i]).css('border-style') == 'solid') {
            $($('.sellable')[i]).css('border', '');
        }
    }
}

export const buySellHandler = (event) => {

    if ($(event.target).css('border-style') == 'solid') {
        $(event.target).css('border', '');
        $('#take-action')[0].disabled = true;
    } else {
        clearBorders()
        $(event.target).css({border: `${event.data.color} solid 3px`})
        $('#take-action')[0].disabled = false;
    }
}

//
export const actionTaken = (event) => {
    for (let i = ($('.buyable').length - 1); i >= 0; i--) {
        if ($($('.buyable')[i]).css('border-style') == 'solid') {
            console.log($('.buyable')[i].alt.split(":")[0])
        }
    }

}

export const loadElementsintoDOM = (game) => {
    game.startGame()
    resestDomBoard(game)
    $(document).on('click', '#lvl-up', {game: game}, levelUpHandler)
    $(document).on('click', '.buyable', {color: 'blue'}, buySellHandler)
    $(document).on('click', '.sellable', {color: 'green'}, buySellHandler)
    $(document).on('click', '#take-action', {game: game}, actionTaken)
    $(document).on('click', '#refresh-recruit', {game: game}, refreshRecruit)
}

let request = new XMLHttpRequest();
request.open('GET', "../../Math-Battle/static/jsons/cardData.json")
request.responseType = 'json';
request.send();

request.onload = function() {
    const data = request.response;

    var game = new Game(data)

    console.log(data)
    loadElementsintoDOM(game);
}