const { Menu } = require('electron');
const { nativeImage } = require('electron/common');
const { app, BrowserWindow, ipcMain, Tray } = require('electron/main');
const path = require('node:path');

let tray;

function createWindow() {

    const screensize = require('electron').screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        x: screensize.width - 400 - 10, // 10px from the right edge
        y: screensize.height - 600 - 10, // 10px from the bottom edge
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#00313d',
            symbolColor: '#74b1be',
            height: 40
        },
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // win.setIcon(path.join(__dirname, 'assets/trayicon.png'));
    win.setIcon(nativeImage.createFromPath(path.join(__dirname, './assets/trayicon.png')));

    win.loadFile(path.join(__dirname, './views/medalsRanking/medalsRanking.html'));
}  

app.whenReady().then(() => {

    const trayIcon = nativeImage.createFromPath(path.join(__dirname, './assets/icon.ico'));
console.log(trayIcon.isEmpty()) // true
    trayIcon.setTemplateImage(true);

    // tray = new Tray(nativeImage.createFromPath(path.join(__dirname, './assets/Vector.pdf')));
    // tray = new Tray(nativeImage.createFromPath(path.join(__dirname, './assets/Vector.svg')));
    const red = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')
    const green = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACOSURBVHgBpZLRDYAgEEOrEzgCozCCGzkCbKArOIlugJvgoRAUNcLRpvGH19TkgFQWkqIohhK8UEaKwKcsOg/+WR1vX+AlA74u6q4FqgCOSzwsGHCwbKliAF89Cv89tWmOT4VaVMoVbOBrdQUz+FrD6XItzh4LzYB1HFJ9yrEkZ4l+wvcid9pTssh4UKbPd+4vED2Nd54iAAAAAElFTkSuQmCC')

    tray = new Tray(trayIcon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Les médailles',
            click: () => {
                const wins = BrowserWindow.getAllWindows()
                if (wins.length === 0) {
                    createWindow()
                } else {
                    wins[0].focus()
                }
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        },
        { role: 'quit' }
    ]);

    tray.setToolTip('Médailles Olympiquer - Milan Cortina 2026');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {    
        const wins = BrowserWindow.getAllWindows()
        if (wins.length === 0) {
            createWindow()
        } else {
           if(wins[0].isMinimized()) {
                wins[0].show()
            }else if(wins[0].isFocused() || wins[0].isVisible()){ 
                wins[0].hide()
            }else{
                wins[0].show()
                wins[0].focus()
            }
        }
    });
    
    createWindow();
});

app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});