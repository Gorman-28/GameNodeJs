const { app, BrowserWindow, screen, ipcMain } = require( 'electron' );
app.on( 'ready', onAppReady );

app.on('window-all-closed', ()=>{
    app.quit();
});

function onAppReady(){

    const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    resizable:false,
    autoHideMenuBar: true,
    center: true,
    backgroundColor: '2d1746',








    });

    win.loadFile( 'public/index.html' );


}


ipcMain.on('exit',(port)=>{
    console.log('leave');
    app.exit(0);
});
