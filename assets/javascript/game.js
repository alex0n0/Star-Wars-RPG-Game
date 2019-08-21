let arrayData = [
    ["X-Wing", "./assets/images/starfighter_x_wing.png", "50", "6", "3"],
    ["Jedi Starfighter", "./assets/images/starfighter_jedi.png", "60", "6", "3"],
    ["V-19 Torrent Starfighter", "./assets/images/starfighter_v_19torrent.png", "70", "6", "3"],
    ["TIE Fighter", "./assets/images/starfighter_tie.png", "80", "6", "3"]
];

let arrayStarfighters = [];

let phases = ['selectPlayer', 'selectEnemy', 'fight'];
let phase = phases[0];

let wins = 0;
let losses = 0;


$(document).ready(function () {
    // setup linking UI
    let p_wins = $('#p_wins');
    let p_losses = $('#p_losses');

    p_wins.text(`Wins: ${wins}`);
    p_losses.text(`Losses: ${losses}`);

    let region_selections = $('#region_selections');


    let region_player = $('#region_player');
    let region_enemies = $('#region_enemies');

    let region_attacker = $('#region_attacker');
    let button_fight = $('#button_fight');
    let region_defender = $('#region_defender');

    let count = 0;
    for (x of arrayData) {
        arrayStarfighters[arrayStarfighters.length] = generateStarfighter(x[0], x[1], x[2], x[3], x[4], count)
        count++;
    }
    for (x of arrayStarfighters) {
        region_selections.append(x[0]);
    }


    console.log(arrayStarfighters);


    let starfighter0 = $('#starfighter_0').parent().parent().parent();
    let starfighter1 = $('#starfighter_1').parent().parent().parent();
    let starfighter2 = $('#starfighter_2').parent().parent().parent();
    let starfighter3 = $('#starfighter_3').parent().parent().parent();
    
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




    let player;
    let enemy;

    // resetGame();

    // function resetGame() {
    // }

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
                    moveStarfighter(starfighter0, region_enemies);
                    moveStarfighter(starfighter1, region_player);
                    arrayStarfighters[1][1].unbind('click', clickStarfighter);
                    moveStarfighter(starfighter2, region_enemies);
                    moveStarfighter(starfighter3, region_enemies);
                    player = arrayStarfighters[1];
                    break;
                case 'starfighter_2':
                    moveStarfighter(starfighter0, region_enemies);
                    moveStarfighter(starfighter1, region_enemies);
                    moveStarfighter(starfighter2, region_player);
                    arrayStarfighters[2][1].unbind('click', clickStarfighter);
                    moveStarfighter(starfighter3, region_enemies);
                    player = arrayStarfighters[2];
                    break;
                case 'starfighter_3':
                    moveStarfighter(starfighter0, region_enemies);
                    moveStarfighter(starfighter1, region_enemies);
                    moveStarfighter(starfighter2, region_enemies);
                    moveStarfighter(starfighter3, region_player);
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
                    moveStarfighter(starfighter0, region_defender);
                    $('#starfighter_0').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[0];
                    break;
                case 'starfighter_1':
                    moveStarfighter(starfighter1, region_defender);
                    $('#starfighter_1').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[1];
                    break;
                case 'starfighter_2':
                    moveStarfighter(starfighter2, region_defender);
                    $('#starfighter_2').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[2];
                    break;
                case 'starfighter_3':
                    moveStarfighter(starfighter3, region_defender);
                    $('#starfighter_3').unbind('click', clickStarfighter);
                    enemy = arrayStarfighters[3];
                    break;
            }
            enemy[0].find('.card').toggleClass('card-no-pointer');
            moveStarfighter(player[0], region_attacker);
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
        moveStarfighter(player[0], region_player);
        moveStarfighter(enemy[0], region_enemies);
        enemy[0].find('.card').toggleClass('card-disabled');
        button_fight.unbind('click', clickFight);
        phase = phases[1];
        region_enemies.toggleClass('bg-danger');
    }
});




function moveStarfighter(starship, region) {
    //NOTE: all event listeners are removed with remove()
    //NOTE: detach maintains click events
    starship.detach();
    region.append(starship);
}

