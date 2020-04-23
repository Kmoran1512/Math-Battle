export default class Game {
    constructor(data, health = 40, round = 1, level = 1, phase="Recruit") {
        this.types = ['Fire', 'Water', 'Grass'];
        this.data = data;
        this.health = health;
        this.round = round;
        this.level = level;
        this.phase = phase;
        this.my_board = [];
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
        console.log(size)
        var pool = this.returnAvailableMinions()
        var board_Row = []
        for (let i = 0; i < size; i++) {
            board_Row.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return board_Row
    }
}

export const resestDomBoard = (game) => {
    var healthBar = `<div class="health-bar">|</div>`
    var coin = `<img src="../static/images/other/Coin_website.png" height="10%" width="100%"/>`

    for (let i = 0; i < game.health; i++) {
        $('#hpBar').append(healthBar);
    }
    for (let i = 0; i < game.round; i++) {
        if (i >= 10) {
            break;
        }
        $('#coins').append(coin);
    }

    var build_a_board = game.generateRandomBoard(Math.min(game.level + 2, 7))



    for (let i = 0; i < build_a_board.length; i++) {
        console.log('hi')
        $('#top-board').append(`<img class="card-img" src="${build_a_board[i].img}" alt="${build_a_board[i].name}: attack ${build_a_board[i].atk}, 
                                health ${build_a_board[i].health}" height="70%" width="13%">`)
    }
}

export const loadElementsintoDOM = (game) => {
    console.log('hi')
    resestDomBoard(game)
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