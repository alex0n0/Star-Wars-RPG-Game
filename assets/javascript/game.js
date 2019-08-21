let arrayStarfighters = [
    new Starfighter(100, 20, 20),
    new Starfighter(100, 20, 20),
    new Starfighter(100, 20, 20),
    new Starfighter(100, 20, 20)
];

let phases = ['selectPlayer', 'selectEnemy', 'fight'];
let phase = phases[0];

$(document).ready(function () {
    // setup linking UI
    let p_wins = $('#p_wins');
    let p_losses = $('#p_losses');


    let region_selections = $('#region_selections');
    let starfighter1 = $('#starfighter_1').parent().parent().parent();
    let starfighter2 = $('#starfighter_2').parent().parent().parent();
    let starfighter3 = $('#starfighter_3').parent().parent().parent();
    let starfighter4 = $('#starfighter_4').parent().parent().parent();

    let region_player = $('#region_player');
    let region_enemies = $('#region_enemies');

    let region_attacker = $('#region_attacker');
    let button_fight = $('#button_fight');
    let region_defender = $('#region_defender');




    let starfighter5 = generateStarfighter('asdf', 100, 3, 14, 5);
    // region_defender.append(starfighter5);



    let player;
    let enemy;


    $('#starfighter_1').on('click', clickStarfighter);
    $('#starfighter_2').on('click', clickStarfighter);
    $('#starfighter_3').on('click', clickStarfighter);
    $('#starfighter_4').on('click', clickStarfighter);

    function clickStarfighter(e) {
        if (phase === phases[0]) {
            switch (e.target.id) {
                case 'starfighter_1':
                    moveStarfighter(starfighter1, region_player);
                    $('#starfighter_1').unbind('click', clickStarfighter);
                    moveStarfighter(starfighter2, region_enemies);
                    moveStarfighter(starfighter3, region_enemies);
                    moveStarfighter(starfighter4, region_enemies);
                    player = starfighter1;
                    break;
                case 'starfighter_2':
                    moveStarfighter(starfighter1, region_enemies);
                    moveStarfighter(starfighter2, region_player);
                    $('#starfighter_2').unbind('click', clickStarfighter);
                    moveStarfighter(starfighter3, region_enemies);
                    moveStarfighter(starfighter4, region_enemies);
                    player = starfighter2;
                    break;
                case 'starfighter_3':
                    moveStarfighter(starfighter1, region_enemies);
                    moveStarfighter(starfighter2, region_enemies);
                    moveStarfighter(starfighter3, region_player);
                    $('#starfighter_3').unbind('click', clickStarfighter);
                    moveStarfighter(starfighter4, region_enemies);
                    player = starfighter3;
                    break;
                case 'starfighter_4':
                    moveStarfighter(starfighter1, region_enemies);
                    moveStarfighter(starfighter2, region_enemies);
                    moveStarfighter(starfighter3, region_enemies);
                    moveStarfighter(starfighter4, region_player);
                    $('#starfighter_4').unbind('click', clickStarfighter);
                    player = starfighter4;
                    break;
            }
            player.find('.card').toggleClass('card-no-pointer');
            region_enemies.toggleClass('bg-danger');
            phase = phases[1];
            console.log(phase);
        } else if (phase === phases[1]) {
            switch (e.target.id) {
                case 'starfighter_1':
                    moveStarfighter(starfighter1, region_defender);
                    $('#starfighter_1').unbind('click', clickStarfighter);
                    enemy = starfighter1;
                    break;
                case 'starfighter_2':
                    moveStarfighter(starfighter2, region_defender);
                    $('#starfighter_2').unbind('click', clickStarfighter);
                    enemy = starfighter2;
                    break;
                case 'starfighter_3':
                    moveStarfighter(starfighter3, region_defender);
                    $('#starfighter_3').unbind('click', clickStarfighter);
                    enemy = starfighter3;
                    break;
                case 'starfighter_4':
                    moveStarfighter(starfighter4, region_defender);
                    $('#starfighter_4').unbind('click', clickStarfighter);
                    enemy = starfighter4;
                    break;
            }
            enemy.find('.card').toggleClass('card-no-pointer');
            moveStarfighter(player, region_attacker);
            region_enemies.toggleClass('bg-danger');
            phase = phases[2];
            
            button_fight.on('click', clickFight);
        }
        //  else if (phase === phases[2]) {
        //     // console.log(phase);
        //     // break;
        // }
    }
    function clickFight() {
        console.log('fightfightfight');
        moveStarfighter(player, region_player);
        moveStarfighter(enemy, region_enemies);
        enemy.find('.card').toggleClass('card-disabled');
        button_fight.unbind('click', clickFight);
        phase = phases[1];
    }
});

function generateStarfighter(name, hp, atk, c_Atk, count) {
    let div_col = $('<div class="col-12 col-sm-6 col-md-3 my-3">');
    let div_card = $('<div class="card h-100">');
    div_col.append(div_card);

    let div_card_top = $('<div class="h-75">');
    div_card.append(div_card_top);
    div_card_top.append($(`<img src="./assets/images/starfighter_x_wing.png" class="card-img-top" alt="...">`));


    let div_card_body = $('<div class="card-body bg-dark text-light">');
    div_card.append(div_card_body);
    div_card_body.append($(`<h6 class="card-title">${name}</h6>`));
    div_card_body.append($(`<p class="card-text my-0">HP: ${hp}/${hp}</p>`));
    div_card_body.append($(`<p class="card-text my-0">ATK: ${atk}</p>`));
    div_card_body.append($(`<p class="card-text my-0">C-ATK: ${c_Atk}</p>`));
    div_card_body.append($(`<a id="starfighter_${count}" class="stretched-link"></a>`));

    return div_col;
}


function moveStarfighter(starship, region) {
    //NOTE: all event listeners are removed with remove()
    //NOTE: detach maintains click events
    starship.detach();
    region.append(starship);
}

