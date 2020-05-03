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
        this.my_fight_board = [];
        this.op_fight_board = [];
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

    checkTypeAdvantage(attacker, defender) {
        return attacker.type == 'Fire' && defender.type == "Grass" || attacker.type == 'Water' && defender.type == "Fire" || 
                attacker.type == 'Grass' && defender.type == "Water";
    }

    getLargestMinionMod2(arr) {
        for (let i = 6; i >= 0; i -= 2) {
            if (arr.length > i) {
                if (arr[i] != undefined) {
                    return i;
                }
            }
        }
        for (let i = 1; i < 6; i += 2) {
            if (arr.length > i) {
                if (arr[i] != undefined) {
                    return i;
                }
            }
        }
        return undefined
    }

    singleAttack() {
        let my_minion = this.my_fight_board[this.getLargestMinionMod2(this.my_fight_board)];
        let op_minion = this.op_fight_board[this.getLargestMinionMod2(this.op_fight_board)];

        if (my_minion == undefined || op_minion == undefined) {
            return undefined;
        }

        if (this.checkTypeAdvantage(op_minion, my_minion)) {
            my_minion.health = my_minion.health - 2 * op_minion.atk
            op_minion.health = op_minion.health - my_minion.atk
        } else if (this.checkTypeAdvantage(my_minion, op_minion)) {
            op_minion.health = op_minion.health - 2 * my_minion.atk
            my_minion.health = my_minion.health - op_minion.atk
        } else {
            op_minion.health = op_minion.health - my_minion.atk
            my_minion.health = my_minion.health - op_minion.atk
        }        
        
        console.log([my_minion, op_minion])
        return [my_minion, op_minion]
    }

    checkAtk() {
        for (let i = 0; i < this.op_fight_board.length; i++) {
            if (this.op_fight_board[i] != undefined) {
                this.dmg += this.op_fight_board[i].lvl;
            }            
        }
        if (this.dmg > 0) {
            this.dmg += this.opp_level
        }
    }

    commenceBlock(num) {
        var total_dmg = 0;
        var block = false;

        if (num == 'p') {
            console.log(num)
            if (this.dmg == 2 || this.dmg == 3 || this.dmg == 5 || this.dmg == 7 || (this.dmg % 2 != 0 && this.dmg % 3 != 0 && this.dmg % 5 != 0 && this.dmg % 7 != 0)) {
                console.log('prime works')
                total_dmg = Math.trunc(this.dmg / 3);
                block = true;
            } else {
                console.log('not prime')
                total_dmg = this.dmg;
            }
        } else {
            if (this.dmg % num == 0) {
                console.log('clank')
                total_dmg = this.dmg / num;
                block = true;
            } else {
                console.log('crash')
                total_dmg = this.dmg;
                block = false;
            }
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

        return [block, total_dmg];
    }

    startGame() {
        this.resetBuyBoard()
        this.my_board = this.generateRandomBoard(Math.min(this.round, 7))
    }
}

export const appendAnimation = async (file, end = false) => {
    if ($('.canvas-video').length == 0) {
        $('#canvas')[0].hidden = false;
        $('#canvas').append(`<video class="canvas-video" src="../static/animations/${file}" autoplay height="100%" width="100%"></video>`)
        $('.canvas-video')[0].onended = () => {
            if (!end) {
                $('.canvas-video').remove();
                $('#canvas')[0].hidden = true;
            } else {
                window.location = 'home.html'
            }
        };
    }
}

export const clearPreviousDom = () => {
    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
    for (let i = ($('.minion-bar').length - 1); i >= 0; i--) {$('.minion-bar')[i].remove();}    
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

export const drawBoard = (loc, arr, empty, classes, index = 1) => {
    var visual_board = boardOrder(arr, empty);

    for (let i = 0; i < visual_board.length; i++) {
        if (visual_board[i].atk == 0) {
            $(loc).append(`<img class="card-img" src="${visual_board[i].img}" 
            alt="" height="70%" width="13%">`);
        } else {
            $(loc).append(`<img class="card-img ${classes}" src="${visual_board[i].img}" 
            alt="${classes} ${visual_board[i].name}: attack ${visual_board[i].atk}, health ${visual_board[i].health}" height="70%" width="13%" tabindex='${index}'>`);
            index += 1;    
        }
    }

    return index
}

export const resestDomBoard = (game) => {
    var healthBar = `<div class="health-bar">|</div>`;
    var coin = `<img class="coin-img" src="../static/images/other/Coin_website.png" alt="coin" height="10%" width="100%"/>`;

    clearPreviousDom()

    if (game.coins <= 0) {
        $('#refresh-recruit')[0].disabled = true;
    } else {
        $('#refresh-recruit')[0].disabled = false;
    }

    $('#round-comp')[0].disabled = false;
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

    $('#top-board')[0].setAttribute('aria-label', "recruit board")
    $('#bottom-board')[0].setAttribute('aria-label', "your board")
    $('#coins')[0].setAttribute('aria-label', `you have ${game.coins}`)
    $('#hpBar')[0].setAttribute('aria-label', `you have ${game.health}`)

    var index = drawBoard('#top-board', game.buy_board, game.data['None'][0], 'buyable')
    
    index = drawBoard('#bottom-board', game.my_board, game.data['None'][0], 'sellable', index)

    $('#refresh-recruit')[0].setAttribute('tabindex', index)
    $('#round-comp')[0].setAttribute('tabindex', index + 1)
    $('#take-action')[0].setAttribute('tabindex', index + 2)

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
    let target = $(event.target);
    let side = $(event.target).attr('class').split(' ')[1];
    let color = '';

    if (side == 'buyable') {
        color = 'blue';
    } else if (side == 'sellable') {
        color = 'green';
    }

    if (target.css('border-style') == 'solid') {
        target.css('border', '');
        $('#take-action')[0].disabled = true;
    } else {
        clearBorders()
        target.css({border: `${color} solid 3px`})
        if (color == 'blue') {
            console.log('buying')
            $('#take-action')[0].innerHTML = 'Buy Minion'
            $('#take-action')[0].setAttribute('aria-label', 'Buy Minion Button')
        } else if (color == 'green') {
            console.log('selling')
            $('#take-action')[0].innerHTML = 'Sell Minion'
            $('#take-action')[0].setAttribute('aria-label', 'Sell Minion Button')
        }
        $('#take-action')[0].disabled = false;
    }
}

export const readBoard = (controller, board) => {
    let speak = '';

    if (controller != 'you') {
        speak = `The ${controller} has: `;
    } else {
        speak = 'You have: '
    }

    let new_board = boardOrder(board, undefined)

    let first = true
    for (let i = 0; i < new_board.length; i++) {
        if (new_board[i] != undefined) {

            if (!first) {
             speak += 'and '
            } else {
                first = false;
            } 

            speak += `a ${new_board[i].name} with ${new_board[i].atk} attack and ${new_board[i].health} health, `
        }
    }

    readMessage(speak)
}

export const readMessage = (mes) => {
    let utter = new SpeechSynthesisUtterance(mes)
    speechSynthesis.speak(utter)
}

export const keyHandler = (event) => {
    console.log(event.key)

    let game = event.data.game

    if ((event.key == 'd' || event.key == 'D') && !$('#take-action')[0].disabled) { // D key
        for (let i = ($('.buyable').length - 1); i >= 0; i--) {
            if ($($('.buyable')[i]).css('border-style') == 'solid') {
                actionTaken(event);
            }
        }
        for (let i = ($('.sellable').length - 1); i >= 0; i--) {
            if ($($('.sellable')[i]).css('border-style') == 'solid') {
                actionTaken(event);
            }
        }
    } else if (event.key == 's' || event.key == 'S') { // S key
        if ($('#round-comp').length >= 1) {
            roundComplete(event);
        } else if ($('#atk-comp').length >= 1) {
            attackComplete(event);
        } else if ($('#def-comp').length >= 1) {
            blockComplete(event);
        }
    } else if ((event.key == 'a' || event.key == 'A') && !$('#refresh-recruit')[0].disabled) { // A key
        refreshRecruit(event);
    } else if (event.key == 'f' || event.key == 'F') { // F key
        levelUpHandler(event);
    } else if (event.key == 'Enter') { // Enter key
        if (!$('#canvas')[0].disabled) {
            leaveNow(event);
        }
        if ($(event.target).attr('class').split(' ')[0] == 'card-img') {
            buySellHandler(event)
        }
    } else if (event.key == 'g' || event.key == 'G') { // G key
        readBoard('you', game.my_board)
    } else if (event.key == 'h' || event.key == 'H') { // H key

        if (game.phase == 'Recruit') {
            readBoard('Buyboard', game.buy_board)
        } else {
            readBoard('Opponent', game.opp_board)
        }

    } else if (event.key == 'j' || event.key == 'J') { // J key
        readMessage('your level is: ' + game.level)
    } else if (event.key == 'k' || event.key == 'K') { // K key
        readMessage('You have: ' + game.coins + ' coins')
    } else if (event.key == 'l' || event.key == 'L') { // L key
        readMessage('You have: ' + game.health + ' health remaining')
    } else if (event.key == 'i' || event.key == 'I') { // I key
        readMessage('It is currently round:' + game.round)
    }
}

export const actionTaken = (event) => {
    var game = event.data.game;

    for (let i = ($('.buyable').length - 1); i >= 0; i--) {
        if ($($('.buyable')[i]).css('border-style') == 'solid') {
            $('audio#buy-sound')[0].play()
            game.purchase($('.buyable')[i].alt.replace('buyable ', '').split(":")[0]);
        }
    }
    for (let i = ($('.sellable').length - 1); i >= 0; i--) {
        if ($($('.sellable')[i]).css('border-style') == 'solid') {
            $('audio#sold-sound')[0].play()
            game.sellMinion($('.sellable')[i].alt.replace('sellable ', '').split(":")[0]);
        }
    }

    resestDomBoard(game)
}

export const drawMinHealth = (game) => {
    for (let i = ($('.minion-bar').length - 1); i >= 0; i--) {$('.minion-bar')[i].remove();}    

    let orig_top = boardOrder(game.opp_board);
    let orig_bot = boardOrder(game.my_board);

    let bot_bar = boardOrder(game.my_fight_board);
    let top_bar = boardOrder(game.op_fight_board);

    for (let i = 0; i < top_bar.length; i++) {
        if (top_bar[i] != undefined) {
            console.log(orig_top[i].health)
            for (let j = 0; j < top_bar[i].health; j++) {
                $('.top-min')[i].innerHTML += (`<div class="minion-bar" style="width: ${100 / orig_top[i].health}%;">&nbsp;</div>`)
            }
        }
        
    }

    for (let i = 0; i < bot_bar.length; i++) {
        if (bot_bar[i] != undefined) {
            console.log(orig_bot[i].health)
            for (let j = 0; j < bot_bar[i].health; j++) {
                $('.bot-min')[i].innerHTML += (`<div class="minion-bar" style="width: ${100 / orig_bot[i].health}%;">&nbsp;</div>`)
            }
        }
        
    }
}

export const handleFights = (game) => {
    let result = game.singleAttack();

    if (result == undefined) {
        console.log([game.my_fight_board, game.op_fight_board]);

        for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
        var index = drawBoard('#top-board', game.op_fight_board, game.data['None'][0], "opponent's");
        index = drawBoard('#bottom-board', game.my_fight_board, game.data['None'][0], 'your', index);

        return false;
    }
    if (result[0].health <= 0) {
        game.my_fight_board[game.getLargestMinionMod2(game.my_fight_board)] = undefined;
    }
    if (result[1].health <= 0) {
        game.op_fight_board[game.getLargestMinionMod2(game.op_fight_board)] = undefined;
    }

    drawMinHealth(game)
    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
    var index = drawBoard('#top-board', game.op_fight_board, game.data['None'][0], "opponent's");
    index = drawBoard('#bottom-board', game.my_fight_board, game.data['None'][0], 'your', index);

    return !(game.op_fight_board.length == 0 || game.my_fight_board.length == 0);
}

export const roundComplete = async (event) => {
    var game = event.data.game;
    game.phase = "Attack";

    $('#Level')[0].innerHTML = `Level: ${game.level}`;
    $('#Phase')[0].innerHTML = `Attack`;
    $('#refresh-recruit')[0].disabled = true;

    appendAnimation('Atk_Phase.mp4')

    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}
    game.buildOpBoard()

    var index = drawBoard('#top-board', game.opp_board, game.data['None'][0], "opponent's")
    index = drawBoard('#bottom-board', game.my_board, game.data['None'][0], 'your', index)

    $('#round-comp').replaceWith(`<button id="atk-comp" type="button" class="bottom-button" style="height: 100%; width: 50%;" tabindex='${index}' disabled>Complete Attack Phase</button>`)
    
    game.my_fight_board = JSON.parse(JSON.stringify(game.my_board))
    game.op_fight_board = JSON.parse(JSON.stringify(game.opp_board))

    drawMinHealth(game)

    await new Promise(r => setTimeout(r, 1000));

    var exit = true

    while (exit) {
        await new Promise(r => setTimeout(r, 1000));
        exit = handleFights(game)
    }
    
    attackComplete(game)
}

export const attackComplete = async (game) => {
    game.phase = "Block";

    game.checkAtk()

    $('#Level')[0].innerHTML = `Level: ${game.level}`;
    $('#Phase')[0].innerHTML = `Block`;
    $('#refresh-recruit')[0].disabled = true;

    for (let i = ($('.card-img').length - 1); i >= 0; i--) {$('.card-img')[i].remove();}

    var index = drawBoard('#top-board', game.op_fight_board, game.data['None'][0], 'surving')

    if (game.dmg > 0) {
        appendAnimation('Block_Phase.mp4');

        $('#atk-comp').replaceWith(`<button id="def-comp" class="bottom-button" type="button" style="height: 100%; width: 50%;" tabindex='${index}'>Complete Block Phase</button>`)

        $('#bottom-board').append(`<div id="inc-dmg" style="background-color: black; color: white; opacity: 80%;"><div><h2> Incoming Damage: ${game.dmg} </h2></div>
            <div><h3 name="block-label">Block with:</h3><select id="shield" style="color: black; font-size: x-large;">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="p">Prime</option>
        </select></div></div>`);
    } else {
        appendAnimation('Victory_1.mp4');
        await new Promise(r => setTimeout(r, 1000));

        $('#atk-comp').replaceWith(`<button id="def-comp" class="bottom-button" type="button" style="height: 100%; width: 50%;" tabindex='${index}'> '' </button>`)
        blockComplete(null, game)
    }
}

export const blockComplete = (event, game=null) => {
    if (game == null) {
        game = event.data.game;
    }
    var block = 0;

    $('#Level')[0].innerHTML = `Level: ${game.level}`;
    $('#Phase')[0].innerHTML = `Recruit`;
    $('#def-comp').replaceWith(`<button id="round-comp" class="bottom-button" style="height: 100%; width: 50%;">Complete Recruit Phase</button>`)

    if (game.dmg > 0) {
        block = $('#shield')[0].value;

        var total = game.commenceBlock(block);
        $('#inc-dmg').remove()

        if (!total[0]) {
            if (game.health <= 0) {
                clearPreviousDom();
                appendAnimation('Defeat.mp4', true);
            } else {
                appendAnimation('Blocking_Fail.mp4');
            }
        } else {
            if (game.health <= 0) {
                clearPreviousDom();
                appendAnimation('Defeat.mp4', true);
            } else {
                appendAnimation('Block_Success.mp4');
            }
        }

    } else {
        game.commenceBlock(1); 
    }

    if (game.health <= 0) {
        clearPreviousDom();
        appendAnimation('Defeat.mp4')
    } else {
        game.resetBuyBoard();
        resestDomBoard(game);
        appendAnimation('Buying_phase.mp4');
    }

}

export const leaveNow = (event) => {
    $('#canvas')[0].hidden = true;
}

export const loadElementsintoDOM = (game) => {
    game.startGame();
    resestDomBoard(game);
    {    
        $(document).on('click', '#lvl-up', {game: game}, levelUpHandler);
        $(document).on('click', '.buyable', buySellHandler);
        $(document).on('click', '.sellable', buySellHandler);
        $(document).on('click', '#take-action', {game: game}, actionTaken);
        $(document).on('click', '#refresh-recruit', {game: game}, refreshRecruit);
        $(document).on('click', '#round-comp', {game: game}, roundComplete);
        $(document).on('click', '#def-comp', {game: game}, blockComplete);
        $(document).on('click', '#canvas', leaveNow);
        $(document).on('keypress', {game: game}, keyHandler)
    }
}

let request = new XMLHttpRequest();
request.open('GET', "../../Math-Battle/static/jsons/cardData.json")
request.responseType = 'json';
request.send();

request.onload = function() {
    const data = request.response;

    var game = new Game(data)

    loadElementsintoDOM(game);
}