export default class Game {
    constructor(minionData, lvl = 1, myHp = 40, opHp = 40) {
        this.minionData = minionData
        this.types = ['Fire', 'Water', 'Grass']
        this.level = lvl;
        this.my_board = [];
        this.my_post_board = [];
        this.opponent_board = [];
        this.opponent_post_board = [];
        this.phase = null;
        this.myHp = myHp;
        this.opHp = opHp;
        this.state = "Attack";
        this.buyboard = [];
        this.round = 1;
    }

    returnAvailableMinions() {
        var available = [];
        this.types.forEach((e) => {
            for (let i = 0; i < this.minionData[e].length; i++) {
                var temp = this.minionData[e][i]
                if (temp.lvl <= this.level) {
                    available.push(temp);
                }
            }
        });
        return available;
    }

    setBuyboard(size = 7) {
        for (let i = 0; i < size; i++) {
            this.buyboard = this.generateRandomBoard(size);
        }
    }

    generateRandomBoard(size = 7) {
        var pool = this.returnAvailableMinions()
        var board_Row = []
        for (let i = 0; i < size; i++) {
            board_Row.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return board_Row
    }

    doAttacks() {

        let myScore = 0;
        let oScore = 0;
        var curr_board = this.my_board;
        var opp_board = this.opponent_board;
        let dmg_to_me = 0;
        let dmg_to_opp = 0;

        for (let i = 0; i < curr_board.length; i++) {
            while (curr_board[i].health > 0 && opp_board[i].health > 0) {
                curr_board[i].health = curr_board[i].health - opp_board[i].atk;
                opp_board[i].health = opp_board[i].health - curr_board[i].atk;
            }

            if (opp_board[i].health > 0) {
                oScore += 1;
            } else if (curr_board[i].health > 0) {
                myScore += 1;
            }
        }

        if (myScore) {
            for (let i = 0; i < curr_board.length; i++) {

                if (curr_board[i].health > 0) {
                    dmg = dmg + curr_board[i].lvl;
                }

            }

            loser = "op";
        } else if (oScore) {

            for (let i = 0; i < opp_board.length; i++) {

                if (opp_board[i].health > 0) {
                    dmg = dmg + opp_board[i].lvl;
                }

            }

            loser = "me";
        }

        this.my_post_board = curr_board;
        this.opponent_post_board = opp_board;
        return [loser, dmg]
    }

    setupNewGame(size = 7) {
        this.setBuyboard();
        this.my_board = this.generateRandomBoard(size);
    }
}

export const loadMinionsAttack = function(game) {

    let dom = `<table id="GameTable" style="width: 100%"><tr>`;

    for (let i = 0; i < 7; i++) {
        if (i == 0) {
            dom = dom + `<th class = "enemyHP">${game.opHp}</th>`;
        } else if (game.opHp >= (i * (40 / 7))) {
            dom = dom +  `<th class = "enemyHP"></th>`;
        } else {
            dom = dom +  `<th class = "blankHp"></th>`;
        }
    }

    dom = dom + `</tr><tr>`;

    for (let i = 0; i < game.opponent_board.length; i++) {
        dom = dom + `<th class="minion"><img src = ${game.opponent_board[i].img} width="200" height="150"></th>`;
    }

    dom = dom + `</tr><tr>`

    for (let i = 0; i < game.my_board.length; i++) {
        dom = dom +  `<th class="minion" ><img src = ${game.my_board[i].img} width="200" height="150"></th>`;
    }

    for (let i = 0; i < 7; i++) {
        if (i == 0) {
            dom = dom + `<th class = "hpBar">${game.myHp}</th>`;
        } else if (game.myHp >= (i * (40 / 7))) {
            dom = dom +  `<th class = "hpBar"></th>`;
        } else {
            dom = dom +  `<th class = "blankHp"></th>`;
        }
    }

    dom = dom + `</table><button class = "submitB" type = "submit">Attack!</button>`

    return dom;
}

export const loadMinionsRecruit = function (game) {
    let dom = `<table id="GameTable" style="..."><tr> <th>RECRUIT!</th> </tr><tr>`

    for (let i = 0; i < game.buyboard.length; i++) {
        dom = dom + `<th class = "buyable" id=${i}><a href="#"><img src = ${game.buyboard[i].img} height="200" width="150"></a></th>`
    }

    dom = dom + `</tr><tr>`

    for (let i = 0; i < game.my_board.length; i++) {
        dom = dom + `<th class = "my-minion" id=${i}><a href="#"><img src = ${game.my_board[i].img} height="200" width="150"></a></th>`
    }

    dom = dom +  `</tr><tr>`

    for (let i = 0; i < game.level; i++) {
        dom = dom + `<td><img class = "image", src = "../static/images/other/Coin_website.png"></td>`
    }

    for (let i = 0; i < 7; i++) {
        if (i == 0) {
            dom = dom + `<th class = "hpBar">${game.myHp}</th>`;
        } else if (game.myHp >= (i * (40 / 7))) {
            dom = dom +  `<th class = "hpBar"></th>`;
        } else {
            dom = dom +  `<th class = "blankHp"></th>`;
        }
    }

    dom = dom + `</table> <button class = "submitB" type = "submit">done</button>`

    return dom;
}

// ?? //
export const loadMinionsDefense = function (game, loser, dmg) {
    let dom = `<table id="GameTable" style="..."><tr> <th> Defend </th> </tr><tr>`

    if (loser === "me") {

        // opponent's health bar
        for (let i = 0; i < 7; i++) {
            if (i == 0) {
                dom = dom + `<th class = "enemyHP">${game.opHp}</th>`;
            } else if (game.opHp >= (i * (40 / 7))) {
                dom = dom +  `<th class = "enemyHP"></th>`;
            } else {
                dom = dom +  `<th class = "blankHp"></th>`;
            }
        }
    
        dom = dom + `</tr><tr>`
    
        for (let i = 0; i < game.opponent_board.length; i++) {
            if (game.opponent_post_board[i].health > 0) {
                dom = dom + `<th class="minion"><img src = ${game.opponent_board[i].img} width="200" height="150"></th>`;
            } else {
                dom = dom + `<th class="no-minion"></th>`;
            }
        }

    } else if (loser === "op") {

    } else {

    }

    

    for (let i = 0; i < game.boardO.length; i++) {
        dom = dom +  `<th class="minion">${ game.boardO[i].maxHealth }</th>`;
    }

    dom = dom +  `</tr><tr> </tr><tr> <th class = "hpBar">${game.myHp}</th> </table> <button class = "submitB" type = "submit">done</button> `
    return dom;
}

//
export const loadElementsintoDOM = function(game)
{    
    $('#root').on("click", ".submitB", function(event) {
        event.preventDefault();
        console.log(game.opHp);
        if (game.state === "Attack") {
            game.state =  "Recruit" //"Defend";
            game.doAttacks(game);
            console.log(game.dmg);
            game.level++;
            game.createBoard(game.level);
            $('#root').empty();
            $('#root').append(loadMinionsAttack(game));

        } else if (game.state=== "Recruit") {
            $('#root').empty();
            $('#root').append(loadMinionsRecruit(game));
            game.state = "Attack";
        } /*else if (game.state === "Defend") {
            if (game.loser === "op") {
                $('#root').empty();
                $('#root').append(loadMinionsRecruit());
                game.state = "Attack";
                game.opHp = game.opHp - 5;
            } else {
                game.state = "Recruit";
                $('#root').empty();
                $('#root').append(loadMinionsDefense());
            }

        }*/ 
    })

    $('#root').on("click", ".defend", function(event) {
        event.preventDefault();
        let id = $(this).attr('id');
        game.myHp = game.myHp - game.dmg % id;
        $('#root').empty();
        $('#root').append(loadMinionsRecruit(game));
        game.state = "Attack";
    })

    $('#root').on("click", ".buyable", function(event) {
        event.preventDefault();
        let id = $(this).attr('id');
        console.log(id + " bought");
        game.board[id] = game.buyboard[id];
        game.createBoard(game.level);
    })

    $('#root').append(loadMinionsRecruit(game));
};

let request = new XMLHttpRequest();
request.open('GET', "../../Math-Battle/static/jsons/cardData.json")
request.responseType = 'json';
request.send();

request.onload = function() {
    const data = request.response;

    console.log(data)
    var game = new Game(data);
    console.log(game.returnAvailableMinions());
    game.setupNewGame();

    loadElementsintoDOM(game);
}