const { app, BrowserWindow } = require( 'electron' );
const express = require( 'express' );
const lol = express();

lol.use(express.static('public'));


app.on( 'ready', onAppReady );

app.on('window-all-closed', ()=>{
    app.quit();
});

function onAppReady(){

    const win = new BrowserWindow({

    frame:false,
    resizable:false,

    center: true,



    titleBarStyle:'hidden',
    fullscreen:true,
    webPreferences : {

        nodeIntegration:true
    }


    });

    win.loadFile( 'public/index.html' );

}
