const { app} = require('electron');

function DownloadServon(){
    window.open("https://github.com/Blonicx/Servon-Api/releases/download/V0.6/Servon-Api.jar", "_self")
    console.log("Downloaded Servon-Api")
};

function Restart(){
    app.relaunch()
    app.exit()
}