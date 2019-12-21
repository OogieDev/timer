const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    let isWindowsShow = false;
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    let win = new BrowserWindow({
        width: 300,
        height: 400,
        x: parseInt(width) - 300,
        y: parseInt(height) - 400,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.on('close', function (event) {
        event.preventDefault()
        win.hide()
        return false
    })
    win.setIcon(path.join(__dirname, '/logo256.png'));
    Menu.setApplicationMenu(null);


    // Tray
    tray = new Tray(path.join(__dirname, '/logo256.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Close', click() { app.exit(0) } }
    ]);
    tray.setToolTip('Timer')
    tray.setContextMenu(contextMenu);
    tray.on('click', function () {
        if (isWindowsShow) {
            win.hide();
        } else {
            win.show();
        }
        isWindowsShow = !isWindowsShow;
    });
    console.log('hi');
    // ipc
    ipcMain.on('save-event', (event, arg) => {
        if (!arg.task || !arg.total) return;
        fs.readFile(path.join(__dirname, '/history.json'), (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(data);

            let history;
            if (data.toString() === "") {
                history = [];
            } else {
                history = JSON.parse(data.toString());
            }
            history.push({...arg, created: Date.now()});
            console.log(history);
            const res = JSON.stringify(history);
            fs.writeFile(path.join(__dirname, '/history.json'), res, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });

    });

    // win.webContents.openDevTools();
    win.loadFile('./html/index.html');
}

app.on('ready', createWindow);