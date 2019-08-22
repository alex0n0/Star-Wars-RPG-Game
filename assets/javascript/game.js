let phases = ['select_player', 'select_enemy', 'fight', 'game_end'];
let phase;

let round_wins;
let round_losses;

let temp_wins;








//randomly generate HP, attack and counter attack
//data for starfighters
let arrayData = [
    ["X-Wing", "./assets/images/starfighter_x_wing.png"],
    ["Jedi Starfighter", "./assets/images/starfighter_jedi.png"],
    ["V-19 Torrent Starfighter", "./assets/images/starfighter_v_19torrent.png"],
    ["TIE Fighter", "./assets/images/starfighter_tie.png"]
];

let arrayStarfighters = [];

//generate starfighters
let count = 0;
for (x of arrayData) {
    arrayStarfighters[arrayStarfighters.length] = generateStarfighter(x[0], x[1], count)
    count++;
}
function generateStarfighter(name, url, count) {
    let hp = parseInt(Math.random() * 99 + 1);
    let atk = parseInt(Math.random() * 14 + 1);
    let c_Atk = parseInt(Math.random() * 14 + 1);
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
    round_wins = 0;
    round_losses = 0;
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
        console.group('round');
        console.log(phase);
        player = undefined;
        enemy = undefined
        temp_wins = 0;

        //attach starfighters to DOM
        for (x of arrayStarfighters) {
            //reset, clear and reattach starfighter elements
            x[0].find('.card').removeClass('card-disabled');
            x[0].find('.card').removeClass('card-no-pointer');
            x[0].detach();
            region_selections.append(x[0]);

            //reset starfighter element and object stats
            x[2].reset();
            x[0].find('.starfighter-hp').text(`HP: ${x[2].getHP()}/${x[2].getBaseHP()}`);
            x[0].find('.starfighter-atk').text(`ATK: ${x[2].getAtk()}`);

            //clear and reattach starfighter element click listeners
            x[1].unbind('click', clickStarfighter);
            x[1].on('click', clickStarfighter);

            //reset fight button
            button_fight.unbind('click', clickFight);
            button_fight.find('i').text('pan_tool');
            button_fight.find('b').text('STANDBY');

            button_fight.removeClass('btn-primary');
            button_fight.removeClass('btn-danger');
            button_fight.removeClass('btn-success');

            button_fight.addClass('btn-secondary');
            button_fight.addClass('button-no-pointer');
        }
    }
    //starfighter controller
    function clickStarfighter(e) {
        if (phase === phases[0]) {
            switch (e.target.id) {
                case arrayStarfighters[0][1].attr('id'):
                    moveStarfighter(arrayStarfighters[0][0], region_player);
                    arrayStarfighters[0][1].unbind('click', clickStarfighter);
                    moveStarfighter(arrayStarfighters[1][0], region_enemies);
                    moveStarfighter(arrayStarfighters[2][0], region_enemies);
                    moveStarfighter(arrayStarfighters[3][0], region_enemies);
                    player = arrayStarfighters[0];
                    break;
                case arrayStarfighters[1][1].attr('id'):
                    moveStarfighter(arrayStarfighters[0][0], region_enemies);
                    moveStarfighter(arrayStarfighters[1][0], region_player);
                    arrayStarfighters[1][1].unbind('click', clickStarfighter);
                    moveStarfighter(arrayStarfighters[2][0], region_enemies);
                    moveStarfighter(arrayStarfighters[3][0], region_enemies);
                    player = arrayStarfighters[1];
                    break;
                case arrayStarfighters[2][1].attr('id'):
                    moveStarfighter(arrayStarfighters[0][0], region_enemies);
                    moveStarfighter(arrayStarfighters[1][0], region_enemies);
                    moveStarfighter(arrayStarfighters[2][0], region_player);
                    arrayStarfighters[2][1].unbind('click', clickStarfighter);
                    moveStarfighter(arrayStarfighters[3][0], region_enemies);
                    player = arrayStarfighters[2];
                    break;
                case arrayStarfighters[3][1].attr('id'):
                    moveStarfighter(arrayStarfighters[0][0], region_enemies);
                    moveStarfighter(arrayStarfighters[1][0], region_enemies);
                    moveStarfighter(arrayStarfighters[2][0], region_enemies);
                    moveStarfighter(arrayStarfighters[3][0], region_player);
                    arrayStarfighters[3][1].unbind('click', clickStarfighter);
                    player = arrayStarfighters[3];
                    break;
            }
            player[0].find('.card').addClass('card-no-pointer');
            region_enemies.toggleClass('bg-danger');
            phase = phases[1];
            console.log(phase);
        } else if (phase === phases[1]) {
            switch (e.target.id) {
                case arrayStarfighters[0][1].attr('id'):
                    moveStarfighter(arrayStarfighters[0][0], region_defender);
                    arrayStarfighters[0][1].unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[0];
                    break;
                case arrayStarfighters[1][1].attr('id'):
                    moveStarfighter(arrayStarfighters[1][0], region_defender);
                    arrayStarfighters[1][1].unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[1];
                    break;
                case arrayStarfighters[2][1].attr('id'):
                    moveStarfighter(arrayStarfighters[2][0], region_defender);
                    arrayStarfighters[2][1].unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[2];
                    break;
                case arrayStarfighters[3][1].attr('id'):
                    moveStarfighter(arrayStarfighters[3][0], region_defender);
                    arrayStarfighters[3][1].unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[3];
                    break;
            }
            for (x of arrayStarfighters) {
                //indicate UNselectable options
                x[0].find('.card').addClass('card-no-pointer');
            }
            moveStarfighter(player[0], region_attacker);
            region_enemies.toggleClass('bg-danger');

            phase = phases[2];

            button_fight.on('click', clickFight);

            button_fight.find('i').text('my_location');
            button_fight.find('b').text('FIGHT');
            button_fight.removeClass('btn-secondary');
            button_fight.addClass('btn-primary');
            button_fight.removeClass('button-no-pointer');
        }
    }







    //button_fight controller

    function clickFight() {
        if (phase === phases[3]) {
            console.groupEnd();
            resetGame();
        } else {
            console.log(phase);
            //adjust HP and increase attack
            player[2].decreaseHP(enemy[2].c_Atk);
            enemy[2].hp -= player[2].atk;
            player[2].increaseAtk();


            if (player[2].hp <= 0 || enemy[2].hp <= 0) {
                button_fight.unbind('click', clickFight);
            }

            if (enemy[2].hp <= 0) {
                enemy[2].hp = 0;
                enemy[0].find('.card').toggleClass('card-disabled');
            }

            if (player[2].hp <= 0) {
                player[2].hp = 0;
                player[0].find('.card').toggleClass('card-disabled');

                //temp win/loss controller
                console.log(`beat ${temp_wins} enem${temp_wins == 1 ? 'y' : 'ies'}`);
                console.log('round lost');
                round_losses++;
                p_losses.text(`Losses: ${round_losses}`);

                //button
                button_fight.find('i').text('mood_bad');
                button_fight.find('b').text('LOSE, Click to Replay');
                button_fight.toggleClass('btn-danger');

                //game end action
                phase = phases[3];
                button_fight.on('click', clickFight);

            } else if (enemy[2].hp <= 0) {
                //temp win/loss controller
                temp_wins++;
                console.log(`beat ${temp_wins} enem${temp_wins == 1 ? 'y' : 'ies'}`);

                //round_controller
                if (temp_wins === 3) {
                    console.log('round won');

                    round_wins++;
                    p_wins.text(`Wins: ${round_wins}`);

                    button_fight.find('i').text('mood');
                    button_fight.find('b').text('WIN, Click to Replay');
                    button_fight.toggleClass('btn-success');

                    //game end action
                    phase = phases[3];
                    button_fight.on('click', clickFight);

                } else {
                    moveStarfighter(enemy[0], region_enemies);
                    phase = phases[1];
                    console.log(phase);
                    region_enemies.toggleClass('bg-danger');


                    button_fight.find('i').text('pan_tool');
                    button_fight.find('b').text('STANDBY');
                    button_fight.removeClass('btn-primary');
                    button_fight.addClass('btn-secondary');
                    button_fight.addClass('button-no-pointer');

                    //indicate selectable options
                    for (x of arrayStarfighters) {
                        if (x[0] !== player[0] && !x[0].find('.card').hasClass('card-disabled')) {
                            x[0].find('.card').removeClass('card-no-pointer');
                        }
                    }
                }
            }



            player[0].find('.starfighter-hp').text(`HP: ${player[2].getHP()}/${player[2].getBaseHP()}`);
            player[0].find('.starfighter-atk').text(`ATK: ${player[2].getAtk()}`);
            enemy[0].find('.starfighter-hp').text(`HP: ${enemy[2].getHP()}/${enemy[2].getBaseHP()}`);
        }
    }
});













//utility function
function moveStarfighter(starfighter, region) {
    //NOTE: all event listeners are removed with remove()
    //NOTE: detach maintains click events
    starfighter.detach();
    region.append(starfighter);
}



///NOTES
// console.log($('#button_fight')); <- returns an array
    // console.log(arrayStarfighters[0][1]); <- this is also identified with jQuery
// console.log((arrayStarfighters[0][1])[0].id); <- can access values this way
    // console.log(arrayStarfighters[0][1][0].id); <- or this way
// console.log($('#button_fight').attr('id')); <- this is the ideal way for using jQuery identifed elements
