// one function handles all transactions, game phases control which action to take
let phases = ['select_player', 'select_enemy', 'fight', 'game_end'];
let phase;

// overall W/L counter
let overallWins = 0;
let overallLosses = 0;

// temporary counter for enemies defeated
let tempRoundWins;
let tempPlayer;
let tempEnemy;











// number of starfighters to generate
let numberStarfighters = 6;

// name & image url of starfighters (hp, attack, counter attack are randomly generated)
let arrayData = [
    ["X-Wing", "./assets/images/starfighter_x_wing.png"],
    ["Jedi Starfighter", "./assets/images/starfighter_jedi.png"],
    ["V-19 Torrent Starfighter", "./assets/images/starfighter_v_19torrent.png"],
    ["TIE Fighter", "./assets/images/starfighter_tie.png"],
    ["Rogue-Class Starfighter", "./assets/images/starfighter_rogue_class.png"],
    ["Z-95 Headhunter", "./assets/images/starfighter_z_95_headhunter.png"]
];

let tempArrayStarfightersObjs = [];

for (let i = 0; i < numberStarfighters; i++) {
    //randomly choose which starfighters to generate
    let index = Math.round((Math.random() * (arrayData.length - 1)));
    tempArrayStarfightersObjs[tempArrayStarfightersObjs.length] = generateStarfighterObj(arrayData[index][0], arrayData[index][1], i);
}

function generateStarfighterObj(name, url, id) {
    let hp = parseInt(Math.random() * 99 + 1);
    let atk = parseInt(Math.random() * 14 + 1);
    let counterAtk = parseInt(Math.random() * 14 + 1);

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
    divCardBody.append($(`<p class="card-text my-0 starfighter-c-atk">C-ATK: ${counterAtk}</p>`));

    let aLink = $(`<a id="starfighter_${id}" class="stretched-link"></a>`);
    divCardBody.append(aLink);

    return {
        element: starfighterElement,
        link: aLink,
        obj: new Starfighter(hp, atk, counterAtk)
    }
}














$(document).ready(function () {
    $('#p_wins').text(`Wins: ${overallWins}`);
    $('#p_losses').text(`Losses: ${overallLosses}`);

    resetGame();
});

/* ############################################################
    - function to reset & setup UI for each round    
############################################################ */
function resetGame() {
    phase = phases[0];
    /////////////////////// DEV (checking game state changes) >>>
    console.group('round');
    console.log(phase);
    /////////////////////// <<< DEV (checking game state changes)
    tempPlayer = undefined;
    tempEnemy = undefined
    tempRoundWins = 0;

    //reset fight button
    $('#button_fight').unbind('click', battleControllerFunction);
    $('#button_fight').find('i').text('pan_tool');
    $('#button_fight').find('b').text('STANDBY');

    $('#button_fight').removeClass('btn-primary');
    $('#button_fight').removeClass('btn-danger');
    $('#button_fight').removeClass('btn-success');

    $('#button_fight').addClass('btn-secondary');
    $('#button_fight').addClass('button-no-pointer');

    //reset region backgrounds
    $('#region_attacker').removeClass('bg-success');
    $('#region_defender').removeClass('bg-danger');


    for (x of tempArrayStarfightersObjs) {
        //reset reattach starfighter elements
        x.element.find('.card').removeClass('card-disabled');
        x.element.find('.card').removeClass('card-no-pointer');
        x.element.detach();
        $('#region_selections').append(x.element);

        //reset starfighter objects stats
        x.obj.resetStats();
        x.element.find('.starfighter-hp').text(`HP: ${x.obj.getHP()}/${x.obj.getBaseHP()}`);
        x.element.find('.starfighter-atk').text(`ATK: ${x.obj.getAtk()}`);

        //reset starfighter element click listeners
        x.link.unbind('click', starfighterControllerFunction);
        x.link.on('click', starfighterControllerFunction);
    }
}


















/* ############################################################
- function to control click events on starfighters
- the action to perform is guarded by the game phases
- the starfighter card will progress the game through game phases 'select_player' and 'select_enemy'
############################################################ */

function starfighterControllerFunction(e) {
    // in the select_player phase
    if (phase === phases[0]) {
        for (x of tempArrayStarfightersObjs) {
            if (x.link.attr('id') === e.target.id) {
                // move the matching one to the player region
                moveStarfighter(x.element, $('#region_player'));
                //disable clicks on the player
                x.link.unbind('click', starfighterControllerFunction);
                tempPlayer = x;
                tempPlayer.element.find('.card').addClass('card-no-pointer');
            } else {
                // move the others to the enemies region
                moveStarfighter(x.element, $('#region_enemies'));
            }
        }
        $('#region_player').addClass('bg-success');
        $('#region_enemies').addClass('bg-danger');
        phase = phases[1];
        /////////////////////// DEV (checking game state changes) >>>
        console.log(phase);
        /////////////////////// <<< DEV (checking game state changes)
    }
    // in the select_enemy phase 
    else if (phase === phases[1]) {
        for (x of tempArrayStarfightersObjs) {
            if (x.link.attr('id') === e.target.id) {
                moveStarfighter(x.element, $('#region_defender'));
                x.link.unbind('click', starfighterControllerFunction);
                tempEnemy = x;
            }
            //name all elements not selectable
            x.element.find('.card').addClass('card-no-pointer');
        }
        moveStarfighter(tempPlayer.element, $('#region_attacker'));
        $('#region_player').removeClass('bg-success');
        $('#region_attacker').addClass('bg-success');
        $('#region_enemies').removeClass('bg-danger');
        $('#region_defender').addClass('bg-danger');

        phase = phases[2];

        // Update fight button to direct user input
        $('#button_fight').on('click', battleControllerFunction);
        $('#button_fight').find('i').text('my_location');
        $('#button_fight').find('b').text('FIGHT');
        $('#button_fight').removeClass('btn-secondary');
        $('#button_fight').addClass('btn-primary');
        $('#button_fight').removeClass('button-no-pointer');
    }
}






















/* ############################################################
- function to control battle events
- the #fight_button will progress the game through game phases 'fight' and 'game_end'
############################################################ */

function battleControllerFunction() {
    // If catches game events if the game phase is not 'game_end'
    if (phase !== phases[3]) {
        /////////////////////// DEV (checking game state changes) >>>
        console.log(phase);
        /////////////////////// <<< DEV (checking game state changes)

        // Adjust HP and increase attack
        tempPlayer.obj.decreaseHP(tempEnemy.obj.getcounterAtk());
        tempEnemy.obj.decreaseHP(tempPlayer.obj.getAtk());
        tempPlayer.obj.increaseAtk();

        // if either starfighter HP == 0, remove all click listeners so no further battle can occur,
        // and update look for each card if their HP == 0
        if (tempPlayer.obj.getHP() <= 0 || tempEnemy.obj.getHP() <= 0) {
            $('#button_fight').unbind('click', battleControllerFunction);

            // loss is recognised when HP <= 0;
            // reset HP to 0 in the case of HP < 0 so it does not render as negative
            if (tempPlayer.obj.getHP() <= 0) {
                tempPlayer.obj.setHP(0);
                tempPlayer.element.find('.card').addClass('card-disabled');
            }
            if (tempEnemy.obj.getHP() <= 0) {
                tempEnemy.obj.setHP(0);
                tempEnemy.element.find('.card').addClass('card-disabled');
            }
        }

        tempPlayer.element.find('.starfighter-hp').text(`HP: ${tempPlayer.obj.getHP()}/${tempPlayer.obj.getBaseHP()}`);
        tempPlayer.element.find('.starfighter-atk').text(`ATK: ${tempPlayer.obj.getAtk()}`);
        tempEnemy.element.find('.starfighter-hp').text(`HP: ${tempEnemy.obj.getHP()}/${tempEnemy.obj.getBaseHP()}`);




        // Assumption: The game is over if the player HP reaches 0 EVEN IF THEY DEFEAT ALL ENEMIES
        if (tempPlayer.obj.getHP() <= 0) {
            // Update losses
            overallLosses++;
            $('#p_losses').text(`Losses: ${overallLosses}`);

            // Move game phase to 'game_end'
            phase = phases[3];

            // Update fight button to direct user input
            $('#button_fight').find('i').text('mood_bad');
            $('#button_fight').find('b').text('LOSE, Click to Replay');
            $('#button_fight').toggleClass('btn-danger');
            $('#button_fight').on('click', battleControllerFunction);

            /////////////////////// DEV (checking game state changes) >>>
            console.log(`beat ${tempRoundWins} enem${tempRoundWins == 1 ? 'y' : 'ies'}`);
            console.log('round lost');
            /////////////////////// <<< DEV (checking game state changes)
        } else if (tempEnemy.obj.getHP() <= 0) {
            /////////////////////// DEV (checking game state changes) >>>
            tempRoundWins++;
            console.log(`beat ${tempRoundWins} enem${tempRoundWins == 1 ? 'y' : 'ies'}`);
            /////////////////////// <<< DEV (checking game state changes)

            // Round controller. Suppose there are 6 enemies, player needs to beat 5 opponents (tempRoundWins = 5) to win the game
            // If block catches defeating an enemy THAT IS NOT THE LAST ENEMY
            if (tempRoundWins !== tempArrayStarfightersObjs.length - 1) {
                moveStarfighter(tempEnemy.element, $('#region_enemies'));
                phase = phases[1];
                /////////////////////// DEV (checking game state changes) >>>
                console.log(phase);
                /////////////////////// <<< DEV (checking game state changes)
                $('#region_enemies').removeClass('bg-danger');
                $('#region_defender').removeClass('bg-danger');

                // Update fight button to direct user input
                $('#button_fight').find('i').text('pan_tool');
                $('#button_fight').find('b').text('STANDBY');
                $('#button_fight').removeClass('btn-primary');
                $('#button_fight').addClass('btn-secondary');
                $('#button_fight').addClass('button-no-pointer');

                // Update cards to show they are clickable ONLY IF THEY ARE NOT DISABLED
                for (x of tempArrayStarfightersObjs) {
                    if (x.element !== tempPlayer.element && !x.element.find('.card').hasClass('card-disabled')) {
                        x.element.find('.card').removeClass('card-no-pointer');
                    }
                }
            }
            // Else block catches when all enemies being defeated
            else {
                /////////////////////// DEV (checking game state changes) >>>
                console.log('round won');
                /////////////////////// <<< DEV (checking game state changes)

                // Update wins
                overallWins++;
                $('#p_wins').text(`Wins: ${overallWins}`);

                // Update fight button to direct user input
                $('#button_fight').find('i').text('mood');
                $('#button_fight').find('b').text('WIN, Click to Replay');
                $('#button_fight').toggleClass('btn-success');

                //game end action
                phase = phases[3];
                $('#button_fight').on('click', battleControllerFunction);

            }
        }
    }
    // Else block catches game events when game phase 'game_end'
    else {
        /////////////////////// DEV (checking game state changes) >>>
        console.groupEnd();
        /////////////////////// <<< DEV (checking game state changes)
        resetGame();
    }

}







// Utility function for moving starfighters to different regions
function moveStarfighter(starfighter, region) {
    starfighter.detach();
    region.append(starfighter);
}
//NOTE: all event listeners are removed with remove()
//NOTE: detach retains click events