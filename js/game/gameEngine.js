export default class Game {
    constructor(data, health = 40, round = 1, level = 1, coins = 3, dmg = 0, opp_level = 1, phase="Recruit") {
        this.types = ['Fire', 'Water', 'Grass'];
        this.data = data;
        this.health = health;
        this.round = round;
        this.level = level;
        this.coins = coins;
        this.dmg = dmg;
        this.opp_level = opp_level
        this.phase = phase;
        this.my_board = [];
        this.buy_board = [];
        this.opp_board = [];
    }

    returnAvailableMinions(bottom = 1, level = this.level) {
        var available = [];
        this.types.forEach((e) => {
            for (let i = 0; i < this.data[e].length; i++) {
                var temp = this.data[e][i]
                if (temp.lvl <= level && temp.lvl >= bottom) {                    
                    available.push(temp);
                }
            }
        });
        return available;
    }

    generateRandomBoard(size = 7, bottom = 1, level = this.level) {
        var pool = this.returnAvailableMinions(bottom, level);
        var board_row = []
        for (let i = 0; i < size; i++) {
            board_row.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return board_row
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

    buildOpBoard() {
        var lower_limit = 1;

        if (this.round > 14) {
            lower_limit = Math.min(Math.round(this.round / 2) - 6, 7);
        }

        var size = Math.min(this.opp_level, 7)

        this.opp_board = this.generateRandomBoard(size, lower_limit, this.opp_level);
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

    purchase(name) {
        if (this.my_board.length < 7) {
            if (this.coins >= 3) {
                var available = this.returnAvailableMinions();

                available.forEach(e => {
                    if (e.name == name) {
                        this.my_board.push(e);
                    }
                });

                this.buy_board.splice(this.buy_board.map(min => min.name).indexOf(name), 1);
                this.coins -= 3;
            } else {
                alert(`it costs 3 coins to buy a minion, you only have ${this.coins}`);
            }
        } else {
            alert("you cannot have more than 7 minions at one time");
        }
    }

    sellMinion(name) {
        this.my_board.splice(this.my_board.map(min => min.name).indexOf(name), 1);
        this.coins += 1;

        if (this.coins > 10) {
            this.coins = 10;
        }
    }

    commenceAtk() {

        var curr_board = [];
        this.my_board.forEach(e => {curr_board.push([e.atk, e.health])});
        var opp_board = [];
        this.opp_board.forEach(e => {opp_board.push([e.atk, e.health])});

        var defeated_arr = []

        for (let i = 0; i < opp_board.length; i++) {
            if (curr_board[i] != undefined) {
                while (curr_board[i][1] > 0 && opp_board[i][1] > 0) {
                    curr_board[i][1] = curr_board[i][1] - opp_board[i][0];
                    opp_board[i][1] = opp_board[i][1] - curr_board[i][0];
                }
            }
                        
            if (opp_board[i][1] > 0) {
                this.dmg += this.opp_board[i].lvl;
            } else {
                defeated_arr.push(i);
            }

        }

        for (let i = (defeated_arr.length - 1); i >= 0; i--) {
            this.opp_board.splice(defeated_arr[i], 1);
        }

        if (this.dmg > 0) {
            this.dmg += this.opp_level;
        }
    }

    commenceBlock(num) {
        var total_dmg = 0

        if (this.dmg % num == 0) {
            total_dmg = this.dmg / num;
        } else {
            total_dmg = this.dmg;
        }

        this.health -= total_dmg;

        if (this.health > 0) {
            this.round += 1;
            this.opp_level = Math.min(7, Math.round(this.round / 2));
            this.coins = Math.min(10, this.round + 2);
            this.phase = 'Recruit';
            this.opp_board = [];
            this.dmg = 0;
        }

        return total_dmg;
    }

    startGame() {
        this.resetBuyBoard()
        this.my_board = this.generateRandomBoard(Math.min(this.round, 7))
    }
}

export const clearPreviousDom = () => {
    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
    for (let i = ($('.health-bar').length - 1); i >= 0; i--) { $('.health-bar')[i].remove();}
    for (let i = ($('.coin-img').length - 1); i >= 0; i--) { $('.coin-img')[i].remove();}
}

export const boardOrder = (arr, empty) => {
    var return_arr = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];

    for (let i = 1; i <= 7; i++) {
        var pos = (Math.pow(-1,(i%2))*(Math.trunc(i/2))) + 3;
        if (arr[i - 1] != undefined) {
            return_arr[pos] = arr[i - 1];
        } else {
            return_arr[pos] = empty;
        }
    }

    return return_arr;
}

export const drawBoard = (loc, arr, empty, classes) => {
    var visual_board = boardOrder(arr, empty);

    for (let i = 0; i < visual_board.length; i++) {
        if (visual_board[i].atk == 0) {
            $(loc).append(`<img class="card-img" src="${visual_board[i].img}" 
            alt="${visual_board[i].name}: attack ${visual_board[i].atk}, health ${visual_board[i].health}" height="70%" width="13%">`);
        } else {
            $(loc).append(`<img class="card-img ${classes}" src="${visual_board[i].img}" 
            alt="${visual_board[i].name}: attack ${visual_board[i].atk}, health ${visual_board[i].health}" height="70%" width="13%">`);    
        }
    }
}

export const resestDomBoard = (game) => {
    var healthBar = `<div class="health-bar">|</div>`;
    var coin = `<img class="coin-img" src="../static/images/other/Coin_website.png" height="10%" width="100%"/>`;

    clearPreviousDom()

    if (game.coins <= 0) {
        $('#refresh-recruit')[0].disabled = true;
    } else {
        $('#refresh-recruit')[0].disabled = false;
    }

    $('#take-action')[0].disabled = true;

    if (game.level < 7) {
        $('#Level')[0].innerHTML = `Level: ${game.level} <button id="lvl-up" style="color: black; height: 100%;"> Level Up </button>`
    } else {
        $('#Level')[0].innerHTML = `Level: ${game.level}`
    }

    $('#Round')[0].innerHTML = `Round: ${game.round}`

    $('#health-helper')[0].innerHTML = `${game.health}`;

    for (let i = 0; i < game.health; i++) { $('#hpBar').append(healthBar); }
    for (let i = 0; i < game.coins; i++) { $('#coins').append(coin); }

    drawBoard('#top-board', game.buy_board, game.data['None'][0], 'buyable')
    
    drawBoard('#bottom-board', game.my_board, game.data['None'][0], 'sellable')

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

export const actionTaken = (event) => {
    var game = event.data.game;

    for (let i = ($('.buyable').length - 1); i >= 0; i--) {
        if ($($('.buyable')[i]).css('border-style') == 'solid') {
            game.purchase($('.buyable')[i].alt.split(":")[0]);
        }
    }
    for (let i = ($('.sellable').length - 1); i >= 0; i--) {
        if ($($('.sellable')[i]).css('border-style') == 'solid') {
            game.sellMinion($('.sellable')[i].alt.split(":")[0]);
        }
    }

    resestDomBoard(game)
}

//
export const roundComplete = (event) => {
    var game = event.data.game;
    game.phase = "Attack";

    $('#Level')[0].innerHTML = `Level: ${game.level}`;
    $('#Phase')[0].innerHTML = `Attack`;
    $('#refresh-recruit')[0].disabled = true;
    $('#round-comp').replaceWith(`<button id="atk-comp" type="button" class="bottom-button" style="height: 100%; width: 50%;">Commece Attack</button>`)

    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
    game.buildOpBoard()

    drawBoard('#top-board', game.opp_board, game.data['None'][0], 'battle')
    drawBoard('#bottom-board', game.my_board, game.data['None'][0], 'battle')

    game.commenceAtk();
}

//
export const attackComplete = (event) => {
    var game = event.data.game;
    game.phase = "Attack";

    $('#Level')[0].innerHTML = `Level: ${game.level}`;
    $('#Phase')[0].innerHTML = `Block`;
    $('#refresh-recruit')[0].disabled = true;
    $('#atk-comp').replaceWith(`<button id="def-comp" class="bottom-button" type="button" style="height: 100%; width: 50%;">Commece Block</button>`)

    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}

    drawBoard('#top-board', game.opp_board, game.data['None'][0], 'battle')

    if (game.dmg > 0) {
        $('#bottom-board').append(`<div id="inc-dmg" style="background-color: black; color: white; opacity: 80%;"><div><h2> Incoming Damage: ${game.dmg} </h2></div>
            <div><h3 name="block-label">Block with:</h3><select id="shield" style="color: black; font-size: x-large;">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select></div></div>`);
    } else {
        $('#bottom-board').append(`<div id="no-dmg" style="background-color: black; color: white; opacity: 80%;">
            <h2>Good Job! you completely stopped the enemy</h2></div>`)
    }
}

//
export const blockComplete = (event) => {
    var game = event.data.game;
    var block = 0;

    $('#Level')[0].innerHTML = `Level: ${game.level}`;
    $('#Phase')[0].innerHTML = `Recruit`;
    $('#def-comp').replaceWith(`<button id="round-comp" class="bottom-button" style="height: 100%; width: 50%;">Complete Recruit</button>`)

    if (game.dmg > 0) {
        block = $('#shield')[0].value;
        var total = game.commenceBlock(block);
        alert(`you take: ${total} damage`);
        $('#inc-dmg').remove()
    } else {
        game.commenceBlock(1); 
        $('#no-dmg').remove()
    }

    if (game.health < 0) {
        clearPreviousDom();
        $('#board').replaceWith(`<h1 style="color: black; text-align: center; top: 50%; position: absolute; left: 45%"> You lost on round ${game.round} \n Good game! </h1>`);
    } else {
        resestDomBoard(game);
    }

}

export const loadElementsintoDOM = (game) => {
    game.startGame();
    resestDomBoard(game);
    $(document).on('click', '#lvl-up', {game: game}, levelUpHandler);
    $(document).on('click', '.buyable', {color: 'blue'}, buySellHandler);
    $(document).on('click', '.sellable', {color: 'green'}, buySellHandler);
    $(document).on('click', '#take-action', {game: game}, actionTaken);
    $(document).on('click', '#refresh-recruit', {game: game}, refreshRecruit);
    $(document).on('click', '#round-comp', {game: game}, roundComplete);
    $(document).on('click', '#atk-comp', {game: game}, attackComplete);
    $(document).on('click', '#def-comp', {game: game}, blockComplete);
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