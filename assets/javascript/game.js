let phases = ['select_player', 'select_enemy', 'fight', 'game_end'];
let phase;

let roundWins;
let roundLosses;

let tempWins;






/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//used for generating starfighter elements
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

//randomly generate HP, attack and counter attack
//data for starfighters
let arrayData = [
    ["X-Wing", "./assets/images/starfighter_x_wing.png"],
    ["Jedi Starfighter", "./assets/images/starfighter_jedi.png"],
    ["V-19 Torrent Starfighter", "./assets/images/starfighter_v_19torrent.png"],
    ["TIE Fighter", "./assets/images/starfighter_tie.png"],
    ["Rogue-Class Starfighter", "./assets/images/starfighter_rogue_class.png"],
    ["Z-95 Headhunter", "./assets/images/starfighter_z_95_headhunter.png"]
];

let arrayStarfighters = [];

//generate starfighters
// let count = 0;
//generate all starfighters
// for (x of arrayData) {
//     arrayStarfighters[arrayStarfighters.length] = generateStarfighter(x[0], x[1], count)
//     count++;
// }

//choose number of starfighters
let numberStarfighters = 6;
let count = 0;
//randomly choose which starfighters to generate
for (let i = 0; i < numberStarfighters; i++) {
    let index = Math.round((Math.random() * (arrayData.length - 1)));
    arrayStarfighters[arrayStarfighters.length] = generateStarfighter(arrayData[index][0], arrayData[index][1], count)
    count++;
}

function generateStarfighter(name, url, count) {
    let hp = parseInt(Math.random() * 99 + 1);
    let atk = parseInt(Math.random() * 14 + 1);
    let cAtk = parseInt(Math.random() * 14 + 1);
    let starfighterElement = $('<div class="col-12 col-sm-6 col-md-3 mb-3">');
    let divCard = $('<div class="card h-100">');
    starfighterElement.append(divCard);

    let divCardTop = $('<div class="h-75 card-top">');
    divCard.append(divCardTop);
    divCardTop.append($(`<img src="${url}" class="card-img-top" alt="...">`));


    let divCardBody = $('<div class="card-body bg-dark text-light">');
    divCard.append(divCardBody);
    divCardBody.append($(`<h6 class="card-title">${name}</h6>`));
    divCardBody.append($(`<p class="card-text my-0 starfighter-hp">HP: ${hp}/${hp}</p>`));
    divCardBody.append($(`<p class="card-text my-0 starfighter-atk">ATK: ${atk}</p>`));
    divCardBody.append($(`<p class="card-text my-0 starfighter-c-atk">C-ATK: ${cAtk}</p>`));

    let aLink = $(`<a id="starfighter_${count}" class="stretched-link"></a>`);
    divCardBody.append(aLink);


    return [starfighterElement, aLink, new Starfighter(hp, atk, cAtk)];
}














$(document).ready(function () {
    // setup linking UI
    roundWins = 0;
    roundLosses = 0;
    let pWins = $('#p_wins');
    let pLosses = $('#p_losses');
    pWins.text(`Wins: ${roundWins}`);
    pLosses.text(`Losses: ${roundLosses}`);

    let regionSelections = $('#region_selections');

    let regionPlayer = $('#region_player');
    let regionEnemies = $('#region_enemies');

    let regionAttacker = $('#region_attacker');
    let buttonFight = $('#button_fight');
    let regionDefender = $('#region_defender');

    let player;
    let enemy;


    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    //setup and reset UI for each round
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    resetGame();
    function resetGame() {
        phase = phases[0];
        console.group('round');
        console.log(phase);
        player = undefined;
        enemy = undefined
        tempWins = 0;

        //attach starfighters to DOM
        for (x of arrayStarfighters) {
            //reset, clear and reattach starfighter elements
            x[0].find('.card').removeClass('card-disabled');
            x[0].find('.card').removeClass('card-no-pointer');
            x[0].detach();
            regionSelections.append(x[0]);

            //reset starfighter element and object stats
            x[2].reset();
            x[0].find('.starfighter-hp').text(`HP: ${x[2].getHP()}/${x[2].getBaseHP()}`);
            x[0].find('.starfighter-atk').text(`ATK: ${x[2].getAtk()}`);

            //clear and reattach starfighter element click listeners
            x[1].unbind('click', clickStarfighter);
            x[1].on('click', clickStarfighter);

            //reset fight button
            buttonFight.unbind('click', clickFight);
            buttonFight.find('i').text('pan_tool');
            buttonFight.find('b').text('STANDBY');

            buttonFight.removeClass('btn-primary');
            buttonFight.removeClass('btn-danger');
            buttonFight.removeClass('btn-success');

            buttonFight.addClass('btn-secondary');
            buttonFight.addClass('button-no-pointer');

            //reset region backgrounds
            regionAttacker.removeClass('bg-success');
            regionDefender.removeClass('bg-danger');
        }
    }



    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    //controller for starfighter elements
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    function clickStarfighter(e) {
        if (phase === phases[0]) {
            weirdFunction1(e.target.id);
            function weirdFunction1(match) {
                for (x of arrayStarfighters) {
                    if (x[1].attr('id') === match) {
                        moveStarfighter(x[0], regionPlayer);
                        x[1].unbind('click', clickStarfighter);
                        player = x;
                    } else {
                        moveStarfighter(x[0], regionEnemies);
                    }
                }
            }
            player[0].find('.card').addClass('card-no-pointer');
            regionPlayer.addClass('bg-success');
            regionEnemies.toggleClass('bg-danger');
            phase = phases[1];
            console.log(phase);
        } else if (phase === phases[1]) {

            weirdFunction2(e.target.id);
            function weirdFunction2(match) {
                for (x of arrayStarfighters) {
                    if (x[1].attr('id') === match) {
                        moveStarfighter(x[0], regionDefender);
                        x[1].unbind('click', clickStarfighter);
                        enemy = x;
                    }
                }
            }

            for (x of arrayStarfighters) {
                //indicate UNselectable options
                x[0].find('.card').addClass('card-no-pointer');
            }
            moveStarfighter(player[0], regionAttacker);
            regionEnemies.toggleClass('bg-danger');
            regionPlayer.removeClass('bg-success');
            regionAttacker.addClass('bg-success');
            regionDefender.toggleClass('bg-danger');

            phase = phases[2];

            buttonFight.on('click', clickFight);

            buttonFight.find('i').text('my_location');
            buttonFight.find('b').text('FIGHT');
            buttonFight.removeClass('btn-secondary');
            buttonFight.addClass('btn-primary');
            buttonFight.removeClass('button-no-pointer');
        }
    }






    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    //controller for fight button actions
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    function clickFight() {
        //end game state
        if (phase === phases[3]) {
            console.groupEnd();
            resetGame();
        } 
        //non-end game state
        else {
            console.log(phase);
            //adjust HP and increase attack
            player[2].decreaseHP(enemy[2].getCAtk());
            enemy[2].decreaseHP(player[2].getAtk());
            player[2].increaseAtk();


            if (player[2].getHP() <= 0 || enemy[2].getHP() <= 0) {
                buttonFight.unbind('click', clickFight);
            }

            //disabled enemy if their HP reaches zero
            if (enemy[2].getHP() <= 0) {
                enemy[2].setHP(0);
                enemy[0].find('.card').toggleClass('card-disabled');
            }

            if (player[2].getHP() <= 0) {
                player[2].setHP(0);
                player[0].find('.card').toggleClass('card-disabled');

                //temp win/loss controller
                console.log(`beat ${tempWins} enem${tempWins == 1 ? 'y' : 'ies'}`);
                console.log('round lost');
                roundLosses++;
                pLosses.text(`Losses: ${roundLosses}`);

                //button
                buttonFight.find('i').text('mood_bad');
                buttonFight.find('b').text('LOSE, Click to Replay');
                buttonFight.toggleClass('btn-danger');

                //game end action
                phase = phases[3];
                buttonFight.on('click', clickFight);

            } else if (enemy[2].getHP() <= 0) {
                //temp win/loss controller
                tempWins++;
                console.log(`beat ${tempWins} enem${tempWins == 1 ? 'y' : 'ies'}`);

                //round_controller
                if (tempWins === arrayStarfighters.length - 1) {
                    console.log('round won');

                    roundWins++;
                    pWins.text(`Wins: ${roundWins}`);

                    buttonFight.find('i').text('mood');
                    buttonFight.find('b').text('WIN, Click to Replay');
                    buttonFight.toggleClass('btn-success');

                    //game end action
                    phase = phases[3];
                    buttonFight.on('click', clickFight);

                } else {
                    moveStarfighter(enemy[0], regionEnemies);
                    phase = phases[1];
                    console.log(phase);
                    regionEnemies.toggleClass('bg-danger');
                    regionDefender.removeClass('bg-danger');

                    buttonFight.find('i').text('pan_tool');
                    buttonFight.find('b').text('STANDBY');
                    buttonFight.removeClass('btn-primary');
                    buttonFight.addClass('btn-secondary');
                    buttonFight.addClass('button-no-pointer');

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
    //NOTE: detach retains click events
    starfighter.detach();
    region.append(starfighter);
}





///NOTES
// console.log($('#button_fight')); <- jquery selections return an array
    // console.log(arrayStarfighters[0][1]); <- this is also identified with jQuery
        // console.log((arrayStarfighters[0][1])[0].id); <- can access attributes like this
        // console.log(arrayStarfighters[0][1][0].id); <- or this way
// console.log($('#button_fight').attr('id')); <- this is a better way for accessing attributes on jQuery selected elements
