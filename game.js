const { app, BrowserWindow, screen, ipcMain } = require( 'electron' );
app.on( 'ready', onAppReady );

app.on('window-all-closed', ()=>{
    app.quit();
});

function onAppReady(){
    const { height: screen_height , width: screen_width} = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
    height: screen_height/2,
    width: screen_width/2,
    titleBarStyle: 'customButtonsOnHover',
    resizable:false,
    autoHideMenuBar: true,
    center: true,
    backgroundColor: '2d1746',
    icon : "public/images/icon.ico",







    });


    win.loadFile( 'public/launcher.html' );



}

ipcMain.on('start',(event,arr)=>{

   const express = require( 'express' );
const serv = express();
const httpServer = require( 'http' ).createServer( serv );
let  ioServer = require('socket.io')( httpServer );






const port = arr;
serv.use(express.static('public'));
    ioServer.set('transports', ['websocket']);



// выдача файлов из папки public


// подключение сокетов


// запуск сервера




    // массив игроков ( храним игроков и их координаты )
    const players = [];

    // массив сокетов игроков
    const players_sockets = [];
    // состояние света

    // клики на кликере

    let player = 0;
    let blue_team = 0;
    let red_team = 0;
    let window_width = 0;
    let window_height = 0;

    let shoot = 0;
    let shoot_num = 0;
    let red_ready = -1;
    let blue_ready = -1;
    let leave_team = '';
    let players_ready = 0;
    let numbers_red = [];
    let numbers_blue = [];
    let start_num_red = 0;
    let start_num_blue = 0;
    let start_num_all = 0;
    let game_state = false;
    // обработка http запросов ( http сервер выдает файлы )

    let box_x = 0;
    let box_y = 0;
    let ability_ran = 0;
    let box = [];
    let box_num = 0;
    let blue_box;
    let red_box;

        console.log( 'connection' );






    // Обработка socket.io запросов ( обмен данными между игроками )
    ioServer.on('connection', (socket) => {
            console.log('a user connected');
            socket.emit('game_state',game_state);
            socket.on('disconnect', ()=>{


            console.log( 'socket disconnected' );
            player--;
            // сообщаем всем удалить его элемент по номеру

            if(players[socket.num].team ==='blue'){
                blue_team--;
                blue_ready--;
                start_num_blue--;
                leave_team = 'blue';
            }
            else if(players[socket.num].team ==='red'){
                red_team--;
                red_ready--;
                start_num_red--;
                leave_team = 'red';
            }
            socket.broadcast.emit( 'some_player_disconnect', socket.num, players[socket.num].name,player,players[socket.num].team,players[socket.num].start_num);
            // удаляем его из массива игроков
            players.splice( socket.num, 1 );

            // удаляем его сокет из массива сокетов
            players_sockets.splice( socket.num, 1 );

            // кореекстирвока номеров игроков
            for( let i = socket.num;i<players_sockets.length; i++){
                players_sockets[ i ].num--;
                if(leave_team ==='blue'){
                    players[ i ].ready_num--;
                }
                else if(leave_team ==='red'){
                    players[ i ].ready_num--;
                }
            }
            for( let i = socket.num;i<players.length; i++){

                if(leave_team ==='blue'){
                    players[ i ].ready_num--;
                }
                else if(leave_team ==='red'){
                    players[ i ].ready_num--;
                }
            }

            socket.broadcast.emit('players_now',players);

        });
        socket.on('some_player_chating',( message,num )=>{

            ioServer.emit('enter_chat',message,num,players[num].name);
        });
        socket.on('delete_player',(num)=>{
            ioServer.emit('delete_player_server',num,blue_team,red_team);
        });

        // если игрок двинулся
        socket.on( 'player_move', (x,y,num,team)=>{
            // обновляем его координаты в его обекте ( в массиве игроков )

            players[ num ].x = x;
            players[ num ].y = y;

            // отсылаем всем его координаты и номер, чтобы его сдвинули
            socket.broadcast.emit( 'some_player_moved', x,y,num,team,players);
        });

        socket.on('take_fire',(team1,my_num,doubleshoot_state)=>{



            ioServer.emit('shoot_now',team1,shoot,shoot_num,my_num,players,doubleshoot_state);



        });

        socket.on('ability_drop',(num_destroy,num,abil)=>{
             box.length = 0;
             ioServer.emit('delete_box');
        });
        socket.on('game_over',(players_user)=>{
                clearInterval(red_box);
                clearInterval(blue_box);

            for(let i = 0;i<players.length;i++){
                players[i].x = 0;
                players[i].y = 0;
                players[i].ready = false;
                game_state = false;
                players_ready = 0;
                ioServer.emit( 'swap_end_ready',players_ready );
            }
                ioServer.emit('delete_box');

        });

        socket.on('swap_ship',(ship,num)=>{
            players[ num ].ship = ship;

            ioServer.emit('swap_ship_all',ship,num,players[ num ].team );
        });
        socket.on('use_ability',(num,ability,x,y,team)=>{
            if(ability === 3){
                ioServer.emit('ability3',num);
            }
            if(ability === 2){
                players[num].shild = true;
                ioServer.emit('ability2',num,team,x,y,players);
            }
        });
        socket.on('ready_check', (ready,my_num)=>{

            if( ready === true ){
                players[my_num].ready = true;
                players_ready++;
                if(players_ready >= (blue_team + red_team) ){

                        spawn_box();


                    game_state = true;
                    ioServer.emit('game_start',players_ready,players);
                }
            }
            else if(ready === false){
                players[my_num].ready = false;
                players_ready--;

            }

            ioServer.emit( 'swap_ready', my_num,ready,players[my_num].team,players[my_num].ready_num,players_ready );
        });


        socket.on('send_name',( name )=>{
            socket.emit('team',name,blue_team,red_team);
            ioServer.emit('fill_team_blue',blue_team);
            ioServer.emit('fill_team_red',red_team);
        });
        socket.on('send_team',(name,team)=>{


            player++;
            // добавляем его сокет в массив
            players_sockets.push( socket );
            if(team ==='blue'){
                blue_team++;
                blue_ready++;
                start_num_blue++;
                start_num_all = start_num_blue;
                ioServer.emit('fill_team_blue',blue_team);
            }if(team ==='red'){
                red_team++;
                red_ready++;
                start_num_red++;
                start_num_all = start_num_red;
                ioServer.emit('fill_team_red',red_team);
            }
            // отправляем подключившемуся игроку массив игроков ( чтобы он у себя их отрисовал )
            socket.emit('send_players', players,players_ready);

            // добавляем подключившегося игрока в массив игроков
            players.push({
                x : 0,
                y : 0,
                name : name,
                team : team,
                ready: false,
                ready_num: 0,
                start_num: start_num_all,
                ship: 1,
                shild: false
            });
            console.log(players);
            // устанавливаем ( запоминаем ) номер подключившегося игрока
            socket.num = players.length - 1;
            if(players[socket.num].team === 'blue'){
             players[socket.num].ready_num = blue_ready;
            }
            if(players[socket.num].team === 'red'){
             players[socket.num].ready_num = red_ready;
            }

            // сказали новому игроку заспавниться

            socket.emit('spawn', socket.num,name,team,players[socket.num].ship,players_ready,players[socket.num].start_num,players );

            // говорим всем в игре о новом игроке
            socket.broadcast.emit('new_player', players[socket.num].name,players[socket.num].team,players[socket.num].ship,players[socket.num].ready,players_ready,players  );
            ioServer.emit( 'start', player );
            // отправка значения кликера



            console.log( socket.num )
            });








    });
function spawn_box(){
        blue_box = setInterval(()=>{

             randomability();
                box.push({

                team: 'blue',
                ability: ability_ran
                });
            box_num = box.length - 1;
            ioServer.emit('spawn_box', box[box_num].team,box[box_num].ability );
        },5000);
        red_box = setInterval(()=>{

              randomability();
                box.push({

                team: 'red',
                ability: ability_ran
                });
            box_num = box.length - 1;
            ioServer.emit('spawn_box',box[box_num].team,box[box_num].ability );
        },5005);





}


function randomability(ability){
    ability_ran = Math.floor(Math.random() * Math.floor(2));
    return ability_ran;
}
ipcMain.on('end',(port)=>{
    ioServer.emit('discon');
    httpServer.close();
    // same as server.close()

});

httpServer.listen( port, () => {
  console.log('listening on : ' + port );
});
});


        /*
            схема обработки сообщений пользователя
            socket - подключенный пользователь

            socket.on('название канала связи',( полученные данные )=>{
                // что-то делаем
            });

            // отправка юзеру данных
            socket.emit( 'название канала связи', параметры );

            // отправка данных всем юзерам, кроме текущего
            socket.broadcast.emit( 'название канала связи', параметры );

            // отправка данных всем юзерам
            ioServer.emit( 'название канала связи', параметры );
        */


        /*---- тут установка прослушивания на действия игрока  ( обработка его собщений сервером -------*/


        // если кто-то вышел



