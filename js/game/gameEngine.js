export default class Game {
    constructor(data, health = 40, round = 1, level = 1, phase="Recruit") {
        this.data = data;
        this.health = health;
        this.round = round;
        this.level = level;
        this.phase = phase;
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