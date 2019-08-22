let phases = ['selectPlayer', 'selectEnemy', 'fight'];
let phase = phases[0];

let round_wins = 0;
let round_losses = 0;

//randomly generate HP, attack and counter attack
//data for starfighters
let arrayData = [
    ["X-Wing", "./assets/images/starfighter_x_wing.png", parseInt(Math.random() * 99 + 1), parseInt(Math.random() * 14 + 1), parseInt(Math.random() * 14 + 1)],
    ["Jedi Starfighter", "./assets/images/starfighter_jedi.png", parseInt(Math.random() * 99 + 1), parseInt(Math.random() * 14 + 1), parseInt(Math.random() * 14 + 1)],
    ["V-19 Torrent Starfighter", "./assets/images/starfighter_v_19torrent.png", parseInt(Math.random() * 99 + 1), parseInt(Math.random() * 14 + 1), parseInt(Math.random() * 14 + 1)],
    ["TIE Fighter", "./assets/images/starfighter_tie.png", parseInt(Math.random() * 99 + 1), parseInt(Math.random() * 14 + 1), parseInt(Math.random() * 14 + 1)]
];

let arrayStarfighters = [];

//generate starfighters
let count = 0;
for (x of arrayData) {
    arrayStarfighters[arrayStarfighters.length] = generateStarfighter(x[0], x[1], x[2], x[3], x[4], count)
    count++;
}
function generateStarfighter(name, url, hp, atk, c_Atk, count) {
    let starfighter_element = $('<div class="col-12 col-sm-6 col-md-3 my-3">');
    let div_card = $('<div class="card h-100">');
    starfighter_element.append(div_card);

    let div_card_top = $('<div class="h-75 card-top">');
    div_card.append(div_card_top);
    div_card_top.append($(`<img src="${url}" class="card-img-top" alt="...">`));


    let div_card_body = $('<div class="card-body bg-dark text-light">');
    div_card.append(div_card_body);
    div_card_body.append($(`<h6 class="card-title">${name}</h6>`));
    div_card_body.append($(`<p class="card-text my-0 starfighter-hp">HP: ${hp}/${hp}</p>`));
    div_card_body.append($(`<p class="card-text my-0 starfighter-atk">ATK: ${atk}</p>`));
    div_card_body.append($(`<p class="card-text my-0 starfighter-c-atk">C-ATK: ${c_Atk}</p>`));

    let a_link = $(`<a id="starfighter_${count}" class="stretched-link"></a>`);
    div_card_body.append(a_link);


    return [starfighter_element, a_link, new Starfighter(hp, atk, c_Atk)];
}
















$(document).ready(function () {
    // setup linking UI
    let p_wins = $('#p_wins');
    let p_losses = $('#p_losses');
    p_wins.text(`Wins: ${round_wins}`);
    p_losses.text(`Losses: ${round_losses}`);

    let region_selections = $('#region_selections');

    let region_player = $('#region_player');
    let region_enemies = $('#region_enemies');

    let region_attacker = $('#region_attacker');
    let button_fight = $('#button_fight');
    let region_defender = $('#region_defender');

    let player;
    let enemy;


    resetGame();    
    function resetGame() {
        phase = phases[0];
        console.log(phase);
        //attach starfighters to DOM
        for (x of arrayStarfighters) {
            x[0].detach();
            region_selections.append(x[0]);
        }

        for (x of arrayStarfighters) {
            x[1].unbind('click', clickStarfighter);
        }
    }

    for (x of arrayStarfighters) {
        x[1].on('click', clickStarfighter);
    }

    function clickStarfighter(e) {
        if (phase === phases[0]) {
            switch (e.target.id) {
                case 'starfighter_0':
                    moveStarfighter(arrayStarfighters[0][0], region_player);
                    arrayStarfighters[0][1].unbind('click', clickStarfighter);
                    moveStarfighter(arrayStarfighters[1][0], region_enemies);
                    moveStarfighter(arrayStarfighters[2][0], region_enemies);
                    moveStarfighter(arrayStarfighters[3][0], region_enemies);
                    player = arrayStarfighters[0];
                    break;
                case 'starfighter_1':
                    moveStarfighter(arrayStarfighters[0][0], region_enemies);
                    moveStarfighter(arrayStarfighters[1][0], region_player);
                    arrayStarfighters[1][1].unbind('click', clickStarfighter);
                    moveStarfighter(arrayStarfighters[2][0], region_enemies);
                    moveStarfighter(arrayStarfighters[3][0], region_enemies);
                    player = arrayStarfighters[1];
                    break;
                case 'starfighter_2':
                    moveStarfighter(arrayStarfighters[0][0], region_enemies);
                    moveStarfighter(arrayStarfighters[1][0], region_enemies);
                    moveStarfighter(arrayStarfighters[2][0], region_player);
                    arrayStarfighters[2][1].unbind('click', clickStarfighter);
                    moveStarfighter(arrayStarfighters[3][0], region_enemies);
                    player = arrayStarfighters[2];
                    break;
                case 'starfighter_3':
                    moveStarfighter(arrayStarfighters[0][0], region_enemies);
                    moveStarfighter(arrayStarfighters[1][0], region_enemies);
                    moveStarfighter(arrayStarfighters[2][0], region_enemies);
                    moveStarfighter(arrayStarfighters[3][0], region_player);
                    arrayStarfighters[3][1].unbind('click', clickStarfighter);
                    player = arrayStarfighters[3];
                    break;
            }
            player[0].find('.card').toggleClass('card-no-pointer');
            region_enemies.toggleClass('bg-danger');
            phase = phases[1];
            console.log(phase);
        } else if (phase === phases[1]) {
            switch (e.target.id) {
                case 'starfighter_0':
                    moveStarfighter(arrayStarfighters[0][0], region_defender);
                    $('#starfighter_0').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[0];
                    break;
                case 'starfighter_1':
                    moveStarfighter(arrayStarfighters[1][0], region_defender);
                    $('#starfighter_1').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[1];
                    break;
                case 'starfighter_2':
                    moveStarfighter(arrayStarfighters[2][0], region_defender);
                    $('#starfighter_2').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[2];
                    break;
                case 'starfighter_3':
                    moveStarfighter(arrayStarfighters[3][0], region_defender);
                    $('#starfighter_3').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[3];
                    break;
            }
            enemy[0].find('.card').toggleClass('card-no-pointer');
            moveStarfighter(player[0], region_attacker);
            region_enemies.toggleClass('bg-danger');

            phase = phases[2];
            console.log(phase);

            button_fight.on('click', clickFight);

            button_fight.find('i').text('my_location');
            button_fight.find('b').text('FIGHT');
            button_fight.removeClass('btn-secondary');
            button_fight.addClass('btn-primary');
        }
    }





    let temp_wins = 0;
    function clickFight() {
        //adjust HP and increase attack
        player[2].hp -= enemy[2].c_Atk;
        enemy[2].hp -= player[2].atk;
        player[2].atk += player[2].baseAtk;


        if (player[2].hp <= 0 || enemy[2].hp <= 0) {
            button_fight.unbind('click', clickFight);
        }

        if (player[2].hp <= 0) {
            player[2].hp = 0;
            player[0].find('.card').toggleClass('card-disabled');
            
            //temp win/loss controller
            console.log(`beat ${temp_wins} enem${temp_wins == 1 ? 'y':'ies'}`);
            console.log('round lost');
            round_losses++;
            p_losses.text(`Losses: ${round_losses}`);
            
            //button
            button_fight.find('i').text('mood_bad');
            button_fight.find('b').text('LOSE, Click to Replay');
            button_fight.toggleClass('btn-danger');
        } else if (enemy[2].hp <= 0) {
            //temp win/loss controller
            temp_wins++;
            console.log(`beat ${temp_wins} enem${temp_wins == 1 ? 'y':'ies'}`);

            //round_controller
            if (temp_wins === 3) {
                console.log('round won');

                round_wins++;
                p_wins.text(`Wins: ${round_wins}`);

                button_fight.find('i').text('mood');
                button_fight.find('b').text('WIN, Click to Replay');
                button_fight.toggleClass('btn-success');
            } else {
                moveStarfighter(enemy[0], region_enemies);
                phase = phases[1];
                console.log(phase);
                region_enemies.toggleClass('bg-danger');

                button_fight.find('i').text('pan_tool');
                button_fight.find('b').text('STANDBY');
                button_fight.removeClass('btn-primary');
                button_fight.addClass('btn-secondary');
            }
        }

        if (enemy[2].hp <= 0) {
            enemy[2].hp = 0;
            enemy[0].find('.card').toggleClass('card-disabled');
        }

        player[0].find('.starfighter-hp').text(`HP: ${player[2].hp}/${player[2].baseHP}`);
        player[0].find('.starfighter-atk').text(`ATK: ${player[2].atk}`);
        enemy[0].find('.starfighter-hp').text(`HP: ${enemy[2].hp}/${enemy[2].baseHP}`);
    }
});













//utility function
function moveStarfighter(starfighter, region) {
    //NOTE: all event listeners are removed with remove()
    //NOTE: detach maintains click events
    starfighter.detach();
    region.append(starfighter);
}

