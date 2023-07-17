'use strict';

const { ipcRenderer } = require('electron');
// настройка соединения с сервером

const socket_config = { transports: ['websocket'], upgrade: false, autoConnect: false };
// ip нужно указать своего компьютера !!

let  adress;
 let  port;
 let  socket;
// создания сокета ( объекта подключения к серверу и обмена с ним сообщениями )

function newPlayerName(){

    if(player_name_input.value.length <= 0){
        console.log('input');

        return;
    }
    else{
    adress = ip.value;
    port = only_num.value;
    socket = io( `http://${ adress }:${ port }` , socket_config );

    socket.connect();
    socket.on('discon',()=>{

        socket.disconnect();

        window.location.reload();
        leave_answer.style.display = 'block';
        leave_ok.addEventListener('click',()=>{
            leave_answer.style.display ='none';
        });
    });
     socket.emit('send_name', player_name_input.value );
         socket.on('connect', ()=>{
             name_box.style.display = 'none';

    console.log( 'socket connected' );


    socket.on('first_start', ()=>{

        console.log(window.screen.height);
        console.log(window.screen.width);





    });
    // получили команду заспавнится ( получая свой номер )
    socket.on('spawn', ( num,name,team1,ship,players_ready,start,players)=>{
        // запоминаем свой номер
        team = team1;
        my_num = num;
        start_num = start;
        starts = true;
         players_user = players;
        igrok_ready.textContent = players_ready + '/10';
        if(team === 'blue'){
            console.log('work');
            ship1.children[0].src = 'images/ship_blue1.png';
            ship2.children[0].src = 'images/ship_blue2.png';
            ship3.children[0].src = 'images/ship_blue3.png';
            ship1.children[0].style.transform ='translate3d(-50%,-50%,0)' +'rotate(-90deg)';
            ship2.children[0].style.transform ='translate3d(-50%,-50%,0)' +'rotate(-90deg)';
            ship3.children[0].style.transform ='translate3d(-50%,-50%,0)' +'rotate(-90deg)';
        }
        if(team === 'red'){
            ship1.children[0].src = 'images/ship_red1.png';
            ship2.children[0].src = 'images/ship_red2.png';
            ship3.children[0].src = 'images/ship_red3.png';
            ship1.children[0].style.transform ='translate3d(-50%,-50%,0)' +'rotate(90deg)';
            ship2.children[0].style.transform ='translate3d(-50%,-50%,0)' +'rotate(90deg)';
            ship3.children[0].style.transform ='translate3d(-50%,-50%,0)' +'rotate(90deg)';
        }

        // запоминаем свой элемент для движения
        playerElem = createPlayer(ship,team);
        if(team1 === 'blue'){
            playerElem.style.backgroundImage = 'url("images/ship_blue1_client.png")';
        }
        else if(team1 === 'red'){
            playerElem.style.backgroundImage = 'url("images/ship_red1_client.png")';
        }


        createNameLine(name,team,ready);


    });
    socket.on('fill_team_red',(red_team)=>{

    team_red_text.textContent = red_team + '/5';

    });
    //red team
    //blue team


    socket.on('fill_team_blue',(blue_team)=>{

        team_blue_text.textContent = blue_team + '/5';

    });

    socket.on('team',(name,blue_team,red_team)=>{
        team_blue_text.textContent = blue_team + '/5';
        team_red_text.textContent = red_team + '/5';
        if(blue_team == 5){}
        else{
            if(game_state2 === false){
            blue.addEventListener('click',()=>{
            team = 'blue';
            blue_alive = blue_team;

            document.body.style.cursor = 'url("images/cursor_blue.png"), auto';
            track0.play();
            track0.volume = 0.1;
            track0.style.borderColor = 'blue';
            ready_check.style.backgroundImage = 'url("images/blue_button.png")';
            ready_background = 'url("images/blue_button.png")';
            choose_team.style.display = 'none';

            socket.emit('send_team',name,team);

        });}
            else{}
        }
        if(red_team == 5){}
        else{
            if(game_state2 === false){
            red.addEventListener('click',()=>{
            team = 'red';
            red_alive = red_team;
            console.log('cursor');
            document.body.style.cursor = 'url("images/cursor_red.png"), auto';
            track0.play();
            track0.volume = 0.1;
            track0.style.borderColor = 'red';
            ready_check.style.backgroundImage = 'url("images/red_button.png")';
            ready_background = 'url("images/red_button.png")';
            choose_team.style.display = 'none';

            socket.emit('send_team',name,team);
        });}
            else{}
        }
});
    // получение игроков, которые были уже в игре до нас
    socket.on('send_players', ( players,players_ready )=>{
        // создаем элементы под них
         players_user = players;
        igrok_ready.textContent = players_ready + '/10';
        createPlayers( players );
        fillNames( players );

    });

    // новый игрок ( кто-то зашел в игру )
    socket.on('new_player', ( name,team1,ship,ready1,players_ready,players)=>{
        // создаем его элемент
         players_user = players;
        igrok_ready.textContent = players_ready + '/10';
        createPlayer(ship,team1);
        createNameLine( name,team1,ready1 );

    });
     socket.on('delete_player_server',(num,blue_team,red_team)=>{
         if(my_num === num){

         }
         players_field.children[num].style.display = 'none';
        if(game_set === false){
        setTimeout(()=>{players_field.children[num].style.display = 'block';},200);
        }
        else if(game_set === true){

            if(players_user[num].team === 'blue'){

                blue_alive--;
                if(blue_alive === 0){
                   win_team = 'red';

                    blue_alive = blue_team;
                    return_to_menu();
                }
            }
            if(players_user[num].team === 'red'){
                red_alive--;
                if(red_alive === 0){
                    win_team = 'blue';
                    red_alive = red_team;
                    return_to_menu();
                }
            }
        }
     });
    // кто-то вышел
    socket.on('some_player_disconnect', ( num, name,player,team,startnum)=>{

        // удаляем его элемент по номеру
        players_field.children[ num ].remove();

            console.log(num);
        if(num < my_num){
             my_num--;
            console.log(my_num);
        }
        if(startnum < start_num){
             start_num--;
            console.log(my_num);
        }

        // удаление имени игрока из панели имен по имени
        if(team==='red'){
            red_alive--;
        for( let i=0;i<players_names_panel.children.length;i++){
            if(players_names_panel.children[ i ].textContent === name ){
                players_names_panel.children[ i ].remove();

            }
        }
        }
        else if(team==='blue'){
             blue_alive--;
        for( let i=0;i<players_names_panel2.children.length;i++){
            if(players_names_panel2.children[ i ].textContent === name ){
                players_names_panel2.children[ i ].remove();

            }
        }
        }

    });
    socket.on('give_number',(my_shufle_number)=>{
        console.log(my_shufle_number);
    });

    // кто-то из игроков двигается
    socket.on('some_player_moved', (x,y,num,team,players)=>{
        // ставим его элементу ( по номеру ) его координаты
        players_user[num].x = x;
        players_user[num].y = y;
        console.log(players_user[num].x);

        players_field.children[ num ].style.top = y + 'px';
        if(team==='blue'){

        players_field.children[ num ].style.left = x + 'px';
        }
        if(team==='red'){

        players_field.children[ num ].style.left = window.innerWidth - Math.ceil((6*(window.innerWidth/100))) + x + 'px';
        }
    });
    socket.on('players_now',(players)=>{
        players_user = players;
    });


    // свет переключился
    socket.on('swap_end_ready',(players_ready)=>{
         igrok_ready.textContent = players_ready + '/10';
    });
    socket.on('swap_ready', (my_num,ready,team,ready_num,players_ready )=>{
        console.log(ready);
        igrok_ready.textContent = players_ready + '/10';
        if(ready === true ){
            if(team === 'blue'){
                players_names_panel2.children[ready_num].style.borderRightColor = '#6df238';
                    players_names_panel2.children[ready_num].style.opacity = '1';
                setTimeout(()=>{
                    players_names_panel2.children[ready_num].style.opacity = '.3';
                },500);

            }
            else if(team === 'red'){
                players_names_panel.children[ready_num].style.borderLeftColor = '#6df238';
                 players_names_panel.children[ready_num].style.opacity = '1';
                setTimeout(()=>{
                    players_names_panel.children[ready_num].style.opacity = '.3';
                },500);
            }
        }
        else if(ready === false){
            if(team === 'blue'){
                players_names_panel2.children[ready_num].style.borderRightColor = 'red';
                players_names_panel2.children[ready_num].style.opacity = '1';
                setTimeout(()=>{
                    players_names_panel2.children[ready_num].style.opacity = '.3';
                },500);
            }
            else if(team === 'red'){
                players_names_panel.children[ready_num].style.borderLeftColor = 'red';
                 players_names_panel.children[ready_num].style.opacity = '1';
                setTimeout(()=>{
                    players_names_panel.children[ready_num].style.opacity = '.3';
                },500);
            }
        }
    });
    socket.on('correct_shoot',(shoot_num)=>{

        if(my_shoot_num > shoot_num){
             my_shoot_num--;
             console.log(my_shoot_num);
        }
        players_shoots.children[shoot_num].remove();

    });
    socket.on('enter_chat',(message,num,name)=>{

        createMessage(message,num,name);
        all_message.scrollTop = all_message.scrollHeight;
        if(chat_active===true){
            console.log('hello');
        big_layer.addEventListener('click',removeChat);

        }
    });
    socket.on('game_start',(players_ready,players)=>{
            track0.pause();
        players_user = players;
            all_stop = true;
            igrok_ready.classList.add('up');
            chat.classList.add('right');
            settings.classList.add('left');
            ready_check.classList.add('down');
            players_names_panel.classList.add('right');
            players_names_panel2.classList.add('left');
            game_set = true;
        game_start = setInterval(()=>{
                if(players_ready >= 1 && number_to_start > 0){
                    start_numbers.style.display = 'block';
                    start_numbers.textContent = number_to_start;
                    number_to_start--;
                    console.log(all_stop);
                }
                else if(number_to_start == 0){
                   start_numbers.textContent = number_to_start;
                    start_numbers.style.display = 'none';

                    all_stop = false;
                    clearInterval(game_start);
                     ready = false;
                    socket.emit('ready_check',ready,my_num);





                }
                else{
                    start_numbers.style.display = 'none';
                    number_to_start = 3;
                    clearInterval(game_start);
                    }
            },1000);
    });
    // кликер значение
    socket.on('swap_ship_all',(ship,num,team2)=>{
        console.log(team2);
        if(team2 ==='blue'){
            if(ship === 1){
                if(my_num === num){
                    players_field.children[num].style.backgroundImage = 'url("images/ship_blue1_client.png")';
                }
                else{
                    players_field.children[num].style.backgroundImage = 'url("images/ship_blue1.png")';
                }

        }
        else if(ship === 2){
             if(my_num === num){
                    players_field.children[num].style.backgroundImage = 'url("images/ship_blue2_client.png")';
                }
                else{
                    players_field.children[num].style.backgroundImage = 'url("images/ship_blue2.png")';
                }

        }
        else if(ship === 3){
            if(my_num === num){
                    players_field.children[num].style.backgroundImage = 'url("images/ship_blue3_client.png")';
                }
                else{
                   players_field.children[num].style.backgroundImage = 'url("images/ship_blue3.png")';
                }

        }
        }
        else if(team2 ==='red'){
            if(ship === 1){
                 if(my_num === num){
                    players_field.children[num].style.backgroundImage = 'url("images/ship_red1_client.png")';
                }
                else{
                  players_field.children[num].style.backgroundImage = 'url("images/ship_red1.png")';
                }

        }
        else if(ship === 2){
             if(my_num === num){
                    players_field.children[num].style.backgroundImage = 'url("images/ship_red2_client.png")';
                }
                else{
                 players_field.children[num].style.backgroundImage = 'url("images/ship_red2.png")';
                }

        }
        else if(ship === 3){
            if(my_num === num){
                    players_field.children[num].style.backgroundImage = 'url("images/ship_red3_client.png")';
                }
                else{
                 players_field.children[num].style.backgroundImage = 'url("images/ship_red3.png")';
                }

        }
        }

    });


    socket.on('ability3',(num)=>{

        if(num == my_num){

            players_field.children[ num ].style.opacity = '.5';
        }
        else{
            players_field.children[ num ].style.opacity = '0';
        }
        setTimeout(()=>{
            players_field.children[ num ].style.opacity = '1';
        },2000);
    });
     socket.on('ability2',(num,team,x,y,players)=>{
         console.log('it work there');
        create_Shild(num,team,x,y,players);
    });

    socket.on('spawn_box',(team,ability)=>{


        if(game_set === true){
            create_Gift(team,ability);
            for(let l = 0;l<players_user.length;l++){
         for(let i = 0;i<box_user.length;i++){
            if(players_user[l].x + (window.innerWidth/100 *6) >= box_user[i].x &&
           players_user[l].x <= box_user[i].x + (window.innerWidth/100 *4) &&
           players_user[l].y + (window.innerHeight/100 *8) >= box_user[i].y &&
           players_user[l].y <= box_user[i].y + (window.innerHeight/100 * 8 )&&
           players_user[l].team === box_user[i].team
          ){
            for(let g = 0;g<box_user.length;g++){
             box_field.children[g].remove();
                }
             box_user.length = 0;
         }
         }
        }
        }

    });
    socket.on('delete_box',()=>{
      elements = document.getElementById("box_field")
                   .getElementsByClassName("box");

while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
}
    });

    socket.on('shoot_now',(team1,shoot,shoot_num,my_num,players,doubleshoot_state)=>{
        if(start_play === 0){
            start_play = 1;
         ShootRight();
        }
         doubleshoot_state1 = doubleshoot_state;
         createShoot(team1,my_num,players);
         players_user = players;


        console.log(doubleshoot_state1);
         team_user = team1;


               /* doubleshoot_interval = setInterval(()=>{
                     createShoot(team1,my_num,players);
                    players_user = players;
                    team_user = team1;
                    ShootRight();
                    doubleshoot_num++;
                    if(doubleshoot_num === 2){
                        doubleshoot_num = 0;
                        clearInterval(doubleshoot_interval);
                    }
                },200)*/



    });
     socket.on('game_state',(game_state1)=>{

      game_state2  = game_state1;
});


   });


    }

// подключаемся к серверу

// происходит автоматически по подключению к серверу




// заполнение имен игроков
function fillNames( players ){
    for( let i =0; i < players.length; i++){
        createNameLine( players[ i ].name ,players[ i ].team ,players[ i ].ready   );
    }
}

function createNameLine( name,team,ready1 ){
    console.log('ok');
    const nameLine = document.createElement( 'div' );
    nameLine.classList.add( 'nameLine' );
    nameLine.textContent = name;

    if(team == 'blue'){
        nameLine.style.borderColor='blue';
        if(ready1 === true){
           nameLine.style.borderRightColor = '#6df238';
        }
        else if(ready1 === false){
           nameLine.style.borderRightColor = 'red';
        }
        else{
           nameLine.style.borderRightColor = 'red';
        }

        socket.emit('team',team);
    players_names_panel2.append( nameLine );
    }
    if(team == 'red'){
         nameLine.style.borderColor='white';
        if(ready1 === true){
          nameLine.style.borderLeftColor = '#6df238';
        }
        else if(ready1 === false){
          nameLine.style.borderLeftColor = 'red';
        }
       else{
          nameLine.style.borderLeftColor = 'red';
       }
        socket.emit('team',team);
    players_names_panel.append( nameLine );
    }
}


function createMessage( message,num,name){

    const message_add = document.createElement( 'div' );
    message_add.classList.add( 'message_chat' );
    message_add.textContent = ' ' + name + ':' + ' ' + message;


    all_message.append( message_add );


    }

// создание игрока ( его элемент ) и добавляем на страницу
function createPlayer(ship,team, x=0, y=0 ){
    const div = document.createElement( 'div' );
    div.classList.add( 'player' );

    if(team ==='blue'){
    if(ship===2){
         div.style.backgroundImage = 'url("images/ship_blue2.png")';
    }
    else if(ship===3){
         div.style.backgroundImage = 'url("images/ship_blue3.png")';
    }
    else{
        div.style.backgroundImage = 'url("images/ship_blue1.png")';
    }


    div.style.top = y + 'px';
    div.style.left = x  + 'px';
    }
    if(team === 'red'){
    if(ship===2){
         div.style.backgroundImage = 'url("images/ship_red2.png")';
    }
    else if(ship===3){
         div.style.backgroundImage = 'url("images/ship_red3.png")';
    }
    else{
        div.style.backgroundImage = 'url("images/ship_red1.png")';
    }


    div.style.top = y + 'px';
    div.style.left = window.innerWidth - Math.ceil((6*(window.innerWidth/100))) + x  + 'px';

    }
    players_field.append( div );
    return div;
}
// создание игроков ( нескольких )
function createPlayers( players ){
    for( let i = 0; i < players.length; i++){
        createPlayer( players[i].ship,players[i].team,players[i].x, players[i].y );
    }
}

function createShoot(team1,my_num,players){

        const div = document.createElement( 'div' );
        div.classList.add( 'fire' );


        div.style.top = (players[my_num].y + 4 * coef_h) - (0.5 * coef_h)  + 'px';
        if(team1 == 'blue'){
        div.style.left = (players[my_num].x + 3 * coef_w) - (1.5 * coef_w)  + 'px';
        shoot_x = (players[my_num].x + 3 * coef_w);
        div.style.backgroundImage = image_shoot;
        }
        if(team1 == 'red'){
        div.style.right = (-players[my_num].x + 3 * coef_w)  + 'px';
        console.log(-players[my_num].x);
        shoot_x = (-players[my_num].x + 3 * coef_w);
        div.style.backgroundImage = image_shoot;
        div.style.transform = "scale(-1, 1)";
        }
        animation = true;
        my_shoot_num++;
        shoots_all.push({
                x : shoot_x,
                y : (players[my_num].y + 4 * coef_h) - (0.5 * coef_h),
                num:my_shoot_num,
                team:team1,
                double:doubleshoot_state1,

            });
            console.log(shoots_all);
        players_shoots.append( div );
       return div;
    }
function create_Gift(team,ability){
    const div = document.createElement( 'div' );
    div.classList.add( 'box' );
    div.style.top = window.innerHeight/2 - (window.innerHeight/100 *4)   + 'px';
    if(team == 'blue'){

        div.style.left = window.innerWidth/2 - (window.innerWidth/100 *1.5) -  (window.innerWidth/100 *4)   + 'px';
            + 'px';
        if(ability === 0){

            div.style.backgroundImage = 'url("images/ability_shoot_blue.png")';
        }
        else if(ability === 1){

            div.style.backgroundImage = 'url("images/ability_inv_blue.png")';
        }
         box_user.push({
            x : window.innerWidth/2 - (window.innerWidth/100 *1.5) -  (window.innerWidth/100 *4),
            y : window.innerHeight/2 - (window.innerHeight/100 *3),
            team: team,
            team: team,
            ability: ability
            });
    }
    else if(team == 'red'){

         div.style.right = window.innerWidth/2  - (window.innerWidth/100 *1.5) -  (window.innerWidth/100 *4)  + 'px';
        if(ability === 0){
           console.log('ability1');
           div.style.backgroundImage = 'url("images/ability_shoot_red.png")';
        }
        else if(ability === 1){
           console.log('ability2');
            div.style.backgroundImage = 'url("images/ability_inv_red.png")';
        }
         box_user.push({
            x :  -window.innerWidth/2 + (window.innerWidth/100 *1.5) +  (window.innerWidth/100 *4),
            y : window.innerHeight/2 - (window.innerHeight/100 *3),
            team: team,
            ability: ability
            });
    }

    box_field.append( div );
    return div;
}
function create_Shild(num,team,x,y,players){
         const div = document.createElement( 'div' );
         div.classList.add( 'shild' );
         div.style.top = y  + 'px';
        if(team == 'blue'){
        div.style.left = (players[num].x + 6 * coef_w)  + 'px';
        shild_x = (players[num].x + 6 * coef_w);
        div.style.backgroundImage = 'url("images/blue_shild.png")';
        console.log('and there');
        }
        else if(team == 'red'){
        div.style.right = (-players[num].x + 6 * coef_w)  + 'px';
        shild_x = (-players[num].x + 6 * coef_w);

        div.style.backgroundImage = 'url("images/red_shild.png")';

        }
        shilds_all.push({
                x : shild_x,
                y : y,
                team:team


         });

        players_shilds.append( div );

       return div;
}
// данные нашего игрока
let my_num = null;
let start_num = null;
let my_shoot_num = -1;
let playerElem = null;
let shootElem = null;
let player_x = 0;
let player_y = 0;
let red_alive = 1;
let blue_alive = 1;
let win_team = '';
let l = 1;
let image_shoot = 'url(images/shoot1.png)';
let resize__num__width;
let resize__num__height;
let coef_h = window.innerHeight/100;
let coef_w = window.innerWidth/100;
let settings_on = false;
let starts = false;
let game_set = false;
let posing = false;
let shoots_all = [];
let shilds_all = [];
let number_i = null;
let number_l = null;
let chat_active = false;
let all_stop = false;
let doubleshoot_state1 = false;
let number_to_start = 3;
let game_start;
let my_shoot_num_user;
let shoots_all_user = [];
let players_user;
let box_user = [];
let start_play = 0;
let ship;
let ability;
let elements;




chat_text.addEventListener('click',()=>{
    if(all_stop === true){return;}
    chat_active = true;
    chat.style.opacity = '1';
    chat_text.style.width = 80 + '%';
    all_message.style.display = 'block';
    submit_mes.style.display = 'block';
    if(team ==='blue'){
        submit_mes.src = 'images/submit_blue.png';
    }
     if(team ==='red'){
        submit_mes.src = 'images/submit_red.png';
    }
    big_layer.style.zIndex = 500;
    submit_mes.addEventListener('click', ()=>{
        if(chat_text.value.length >0 && chat_text.value != ' '){


                socket.emit('some_player_chating',chat_text.value,my_num);
                chat_text.value = '';
            }
    });
    big_layer.addEventListener('click',removeChat);
});


document.addEventListener('keydown', onKeydown);
document.addEventListener('keyup', onKeyup);
document.addEventListener('contextmenu', ()=>{

    keys();
        function keys(e){
            event.preventDefault(e);
        return;
    }
     if(all_stop === true){return;}
    if(chat_active == true){return;}
    else if(chat_active == false) {

    if(starts == true){
        if(shoot == true){
            console.log('gg');
            return;
        }
        else{

            console.log('no');
            shoot = true;
            if(doubleshoot === false){
                 socket.emit('take_fire',team,my_num,doubleshoot);
            }
            if(doubleshoot === true){

                 socket.emit('take_fire',team,my_num,doubleshoot);
                 doubleshoot = false;
            }


            setTimeout(()=>{shoot = false;},1500);
        }
    }
    }
    });


ready_check.addEventListener('mousedown', ()=>{
     if(all_stop === true){return;}
    if(chat_active === true){return;}
    else if(chat_active === false) {
    if(ready === false){

        ready = true;
        ready_check.style.backgroundImage = 'url("images/green_button.png")';

        ready_check.style.textAlign = 'center';
        socket.emit('ready_check',ready,my_num);
    }
    else if(ready === true){

        ready = false;
       ready_check.style.backgroundImage = ready_background;

        ready_check.style.textAlign = 'center';
        socket.emit('ready_check',ready,my_num);
    }
    }
});





settings_image.addEventListener('click',()=>{
    if(all_stop === true){return;}
   if(settings_on === false){
       settings_menu.style.display = 'block';
       settings_on = true;
   }
   else if(settings_on === true){
       settings_menu.style.display = 'none';
       settings_on = false;
   }
});

// choose team
//red team



//blue team
//choose


//choose


let step_w = Math.ceil(window.innerWidth/120);
let step_h = Math.ceil(window.innerHeight/120);
let team = null;
let ready_background = null;
let team_user = null;
let movingID_left = null;
let movingID_right = null;
let movingID_top = null;
let movingID_bottom = null;
let movingRight = false;
let movingLeft = false;
let movingUp = false;
let movingDown = false;
let shoot = false;
let player_touch = false;
let step_shoot =  Math.ceil(window.innerWidth/80);
let step_shoot2 =  Math.ceil(window.innerWidth/40);
let movingID_shoot = null;
let shoot_x=null;
let shild_x=null;
let animation = true;
let game_state2 = false;
let double_shoot_num = 0;
let my_ability = 3;
let ready = false;
let doubleshoot = false;
let doubleshoot_interval;
let doubleshoot_num = 0;
let num_to_destroy = 0;

blue.addEventListener('mouseover',()=>{
    document.getElementById('choose__image').src = 'images/choose_team.gif';
});
red.addEventListener('mouseover',()=>{
    document.getElementById('choose__image').src = 'images/choose_team2.gif';
});

function onKeydown(e){

    if(e.which === 27){
        want_to_leave.style.display = 'block';
        leave_yes.addEventListener('click',()=>{
            console.log('leave');
            ipcRenderer.send('exit',port);
        });
        leave_no.addEventListener('click',()=>{
            want_to_leave.style.display = 'none';
        });

    }
    if(e.which === 49){
        if(my_ability === 0){
            my_ability = 3;
            doubleshoot = true;
        }


    }
    if(e.which === 13 && chat_active === true){
        if(chat_text.value.length >0 && chat_text.value != ' '){


                socket.emit('some_player_chating',chat_text.value,my_num);
                chat_text.value = '';
            }
    }

    if(e.which === 50){
        if(my_ability === 1){
            my_ability = 3;
            ability = 3;
            socket.emit('use_ability',my_num,ability);
        }


    }


    if(chat_active === true){return;}
    if(all_stop === true){return;}
    else if(chat_active === false) {
    if(e.which === 68 && movingRight === false ){
        movingRight = true;

        if(team==='blue'){
             moveRight();
        }
        if(team==='red'){
             moveRight1();
        }

    }

    if(e.which === 65 && movingLeft === false ){

        movingLeft = true;
        if(team==='blue'){
              moveLeft();
        }
        if(team==='red'){
              moveLeft1();
        }



    }

    if(e.which === 83 && movingDown === false ){

        movingDown = true;


        moveDown();

    }
    if(e.which === 87 && movingUp === false ){

        movingUp = true;


        moveUp();
    }
}
}
function onKeyup(e){
    if(chat_active === true){return;}
    else if(chat_active === false) {
    if(e.which === 68 && movingRight === true ){
        movingRight = false;

        cancelAnimationFrame( movingID_right );


    }

    if(e.which === 65 && movingLeft === true ){

        movingLeft = false;
        cancelAnimationFrame( movingID_left );


    }
    if(e.which === 83 && movingDown === true ){

        movingDown = false;
        cancelAnimationFrame( movingID_bottom );


    }if(e.which === 87 && movingUp === true ){

        movingUp = false;
        cancelAnimationFrame( movingID_top );

    }
    }
}




function moveRight(){

    if(player_x+Math.ceil((6*(window.innerWidth/100))) >= 48 * (window.innerWidth/100)   ){

        return;
    }

    movingID_right = requestAnimationFrame( moveRight );
    player_x+= step_w;
    move_all();
}
function move_all(){
    playerElem.style.transform = 'translateX('+ player_x  +'px)' + 'translateY(' + player_y  + 'px)';
    if(box_user.length <1){

    }
    else{
    for(let i = 0;i<box_user.length;i++){
        if(player_x + (window.innerWidth/100 *6) >= box_user[i].x &&
           player_x <= box_user[i].x + (window.innerWidth/100 *4) &&
           player_y + (window.innerHeight/100 *8) >= box_user[i].y &&
           player_y <= box_user[i].y + (window.innerHeight/100 * 8 )&&
           team === box_user[i].team
          ){
            my_ability = box_user[i].ability;

            num_to_destroy = i;
            socket.emit('ability_drop',num_to_destroy,my_num,box_user[i].ability);
         }
         }
    }
    if(team==='blue'){
         players_user[my_num].x = player_x;
    }
    if(team==='red'){
         players_user[my_num].x = -player_x;

    }
    players_user[my_num].y = player_y;
    socket.emit('player_move',player_x,player_y,my_num,team);
}
function moveRight1(){

    if(-player_x <= border_right_red){

       return;
    }

    movingID_right = requestAnimationFrame( moveRight1 );
    player_x+= step_w;
    move_all();
}
function moveLeft(){
    if(player_x <= border_left_bl ){

        return;
    }


    movingID_left = requestAnimationFrame( moveLeft );
    player_x-= step_w;
    move_all();
}
function moveLeft1(){
    if(player_x-Math.ceil((6*(window.innerWidth/100))) <= -48 * (window.innerWidth/100)){

       return;
    }
    console.log(player_x);

    movingID_left = requestAnimationFrame( moveLeft1 );
    player_x-= step_w;
    move_all();
}
function moveUp(){
    if(player_y  <= border_top  ){

        return;
    }

    movingID_top = requestAnimationFrame( moveUp );
    player_y-= step_h;
    move_all();
}
function moveDown(){
    if(player_y+ Math.ceil((8 * (window.innerHeight/100)))  >= border_bottom ){

        return;
    }

    movingID_bottom = requestAnimationFrame( moveDown );
    player_y+= step_h;
    move_all();
}
function ShootRight(){




    movingID_shoot = requestAnimationFrame( ShootRight );




    for(let i = 0;i<shoots_all.length;i++){
        if(shoots_all[i].team === 'blue'){
                 console.log('My name is Dania');
           console.log(shoots_all[i].double);
            if(shoots_all[i].double === true){
                shoots_all[i].x = shoots_all[i].x+=step_shoot2;


                players_shoots.children[i].style.left = shoots_all[i].x + 'px';
            }
            else if(shoots_all[i].double === false){
                shoots_all[i].x = shoots_all[i].x+=step_shoot;

                players_shoots.children[i].style.left = shoots_all[i].x + 'px';
            }

        }
        else if(shoots_all[i].team === 'red'){
        if(shoots_all[i].double === true){
                shoots_all[i].x = shoots_all[i].x+=step_shoot2;
                players_shoots.children[i].style.right =  shoots_all[i].x + 'px';
            }
            else if(shoots_all[i].double === false){
                shoots_all[i].x = shoots_all[i].x+=step_shoot;
                players_shoots.children[i].style.right =  shoots_all[i].x + 'px';
            }
        }
        check_shoot();

    }

}


function check_shoot(){

     for(let l = 0;l<players_user.length;l++){

    for(let i = 0;i<shoots_all.length;i++){

         if(shoots_all[i].x > window.innerWidth){
         number_i = i;

         player_touch = false;
         delete_and_hide();
         animation = false;

         }
        else if(shoots_all[i].team ==='blue'){

        console.log(shoots_all[i].x);
        if((shoots_all[i].x + 5 * coef_w )  >= window.innerWidth + (players_user[l].x - 6 * coef_w)    && players_user[l].team === 'red'){
                console.log(players_user[l].x + 6 * coef_w);
                if(shoots_all[i].y  >= players_user[l].y  && shoots_all[i].y + 1 * coef_h <= players_user[l].y + 8 * coef_h ){
                    number_i = i;
                    number_l = l;

                    player_touch = true;
                    delete_and_hide();




                    animation = false;

                }


        }

        }
        else if(shoots_all[i].team ==='red'){

        if((shoots_all[i].x + 5 * coef_w )  >= window.innerWidth - (players_user[l].x + 6 * coef_w)  && players_user[l].team === 'blue'){
                if(shoots_all[i].y  >= players_user[l].y  && shoots_all[i].y + 1 * coef_h <= players_user[l].y + 8 * coef_h ){
                    number_i = i;
                    number_l = l;

                    player_touch = true;
                    delete_and_hide();




                    animation = false;

                }


        }

        }



    }

    }

}
function correct_nums(){
    for(let l = number_i;l<shoots_all.length;l++){
        shoots_all[l].num--;
    }

    return;
}








function return_to_menu(){
        game_state2 =
        socket.emit('game_over');

        box_user.length = 0;
        for(let i = 0;i<players_user.length;i++){
             players_field.children[i].style.display = 'block';

        }
        win_team_div.style.display = 'block';
        if(win_team === 'blue'){
            win_team_div.style.backgroundImage = 'url("images/victory_blue.gif")';
        }
        else if(win_team === 'red'){
            win_team_div.style.backgroundImage = 'url(images/victory_red.gif)';
        }
    setTimeout(()=>{
            win_team_div.style.display = 'none';
    },3000);
    console.log('win');
    number_to_start = 3;

        border_size_w = 0;
        border_size_h = 0;
        border_top = 0;
        border_bottom = window.innerHeight;
        border_left_bl = 0 ;
        border_right_red = 0 ;
        clearInterval(inter);
        track0.play();
        play_zone.style.borderTopWidth = border_size_h + 'px';
        play_zone.style.borderBottomWidth = border_size_h + 'px';
        play_zone.style.borderLeftWidth = border_size_w + 'px';
        play_zone.style.borderRightWidth = border_size_w + 'px';
        igrok_ready.classList.remove('up');
        chat.classList.remove('right');
        settings.classList.remove('left');
        ready_check.classList.remove('down');
        players_names_panel.classList.remove('right');
        players_names_panel2.classList.remove('left');




    ready_check.style.backgroundImage = ready_background;

    ready_check.style.textAlign = 'center';
    for(let i = 0;i<players_user.length;i++){
        players_field.children[i].style.display = 'block';
        players_field.children[i].style.top = 0;

        if(players_user[i].team === 'red'){
            console.log('red_work');
             players_field.children[i].style.left = window.innerWidth - Math.ceil((6*(window.innerWidth/100))) + 0  + 'px';

        }
        else if(players_user[i].team === 'blue'){
             console.log('blue_work');
            players_field.children[i].style.left = 0 + 'px';

        }

    }
    for(let i = 0; i < document.getElementById('ready1').length; i++) {
            ready1.children[i].style.backgroundColor = 'red';
        }
    for(let i = 0; i < document.getElementById('ready2').length; i++) {
        ready2.children[i].style.backgroundColor = 'red';
    }


    setTimeout(()=>{
        game_start_layer.style.display = 'none';
        game_set = false;

    },2000);
}
function delete_and_hide(){
    console.log('hi');

    console.log(number_i);
        players_shoots.children[number_i].remove();
        my_shoot_num--;

        shoots_all.splice( number_i, 1 );
    correct_nums(shoots_all,number_i);
    if(player_touch === false){
        return;
    }
    else{
        socket.emit('delete_player',number_l);

    }
    return;
}





function removeChat(){
    console.log('not work');
    big_layer.style.zIndex = 0;
    chat.style.opacity = '.3';
    all_message.style.display = 'none';
            submit_mes.style.display = 'none';
            chat_active = false;
            return;
}
/*window.addEventListener("resize", ()=>{
    coef_h = window.innerHeight/100;
    coef_w = window.innerWidth/100;
    step_w = Math.ceil((window.innerWidth/1000)*3);
    step_h = Math.ceil((window.innerWidth/1000)*3);
    step_shoot = (window.innerWidth/1000)*5;
    if(window.innerWidth === window.screen.width){

        player_x = player_x*resize__num__width;
        if(team ==='blue'){
        playerElem.style.left = player_x + 'px';
        }
        if(team ==='red'){
        playerElem.style.right = player_x + 'px';
        }
    }
    else if(window.innerWidth < window.screen.width){
        resize__num__width = window.screen.width/window.innerWidth;
        player_x = player_x/resize__num__width;
        if(team ==='blue'){
        playerElem.style.left = player_x + 'px';
        }
        if(team ==='red'){
        playerElem.style.right = player_x + 'px';
        }
    }
    if(window.innerHeight === window.screen.height){

        player_y = player_y*resize__num__height;
        playerElem.style.top = player_y + 'px';
    }
    else if(window.innerHeight < window.screen.height){
        resize__num__height = window.screen.height/window.innerHeight;
        player_y = player_y/resize__num__height;
        playerElem.style.top = player_y + 'px';
    }
    socket.emit('player_move',player_x,player_y,my_num,team);
    console.log(player_x);

});*/
/*------name enter logic------*/

/*------Game Zone------*/
    let border_grow_w;
    let border_grow_h;
    let border_size_w = 0;
    let border_size_h = 0;
    let border_top = 0;
    let border_bottom = window.innerHeight ;
    let border_left_bl = 0;
    let border_right_red = 0;
    let inter;



ship1.addEventListener('click',()=>{
    ship1.style.borderColor = 'rgba(0,255,0,1)';
    ship2.style.borderColor = 'rgba(255,255,255,.2)';
    ship3.style.borderColor = 'rgba(255,255,255,.2)';
    ship = 1;

    socket.emit('swap_ship',ship,my_num);
});

ship2.addEventListener('click',()=>{
    ship1.style.borderColor = 'rgba(255,255,255,.2)';
    ship2.style.borderColor = 'rgba(0,255,0,1)';
    ship3.style.borderColor = 'rgba(255,255,255,.2)';
    ship = 2;

    socket.emit('swap_ship',ship,my_num);
});

ship3.addEventListener('click',()=>{
    ship1.style.borderColor = 'rgba(255,255,255,.2)';
    ship2.style.borderColor = 'rgba(255,255,255,.2)';
    ship3.style.borderColor = 'rgba(0,255,0,1)';
    ship = 3;

    socket.emit('swap_ship',ship,my_num);
});

shot1.addEventListener('click',()=>{
    shot1.style.borderColor = 'rgba(0,255,0,1)';
    shot2.style.borderColor = 'rgba(255,255,255,.2)';
    image_shoot = 'url("images/shoot1.png")';

});

shot2.addEventListener('click',()=>{
    shot1.style.borderColor = 'rgba(255,255,255,.2)';
    shot2.style.borderColor = 'rgba(0,255,0,1)';
    image_shoot ='url("images/shoot2.png")';
});
}
player_name_button.addEventListener( 'click', newPlayerName);
track0.addEventListener( 'ended', ()=>{
      track0.play();
 });





