const { Menu } = require('electron');
const { nativeImage } = require('electron/common');
const { app, BrowserWindow, ipcMain, Tray, Notification } = require('electron/main');
const path = require('node:path');

let tray;
let lastMedalsLoaded = null;

function createWindow() {

    const screensize = require('electron').screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        x: screensize.width - 400 - 10, // 10px from the right edge
        y: (isMacOS() ? 40 : screensize.height - 600 - 10), // 10px from the bottom edge
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#00313d',
            symbolColor: '#74b1be',
            height: 40
        },
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false,
        resizable: false,
        frame: false,
    });

    // win.setIcon(path.join(__dirname, 'assets/trayicon.png'));
    if(isMacOS()) {
        win.setIcon(nativeImage.createFromPath(path.join(__dirname, './assets/icons/icon-para.icns')));
    } else {
        win.setIcon(nativeImage.createFromPath(path.join(__dirname, './assets/icons/icon-para.ico')));
    }

    win.loadFile(path.join(__dirname, './views/medalsRanking/medalsRanking.html'));

    win.on('close', (event) => {
        // event.preventDefault();
        win.hide();
    });
}  

app.whenReady().then(() => {

    let trayIconPath = '';

    if(isMacOS()) {
        // trayIconPath = path.join(__dirname, './assets/trayTemplate.png');
        trayIconPath = path.join(__dirname, './assets/trayParaTemplate.png');
        app.dock.setIcon(nativeImage.createFromPath(path.join(__dirname, './assets/icon-para-1024.png')));
        app.dock.hide();
    } else {
        trayIconPath = path.join(__dirname, './assets/icon-para.ico');
    }
    
    const trayIcon = nativeImage.createFromPath(trayIconPath);

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
            label: 'Quitter',
            click: () => {
                app.quit();
            },
            role: 'quit'
        }
    ]);

    tray.setToolTip('Médailles Olympiques - Milan Cortina 2026');
    tray.setContextMenu(contextMenu);
    tray.on('click', (e) => {    
        contextMenu.closePopup()
        showHideOrCreateWindow();
    });
    
    createWindow();

    setTimeout(() => {
        showNotification();
        console.log('Notification sent');
    }, 5000);

    console.log('App is ready');
    loadCurrentMedals();

    setInterval(() => {
        console.log('Refreshing medals data:', lastMedalsLoaded);
        loadCurrentMedals();
    }, 5000)//, 5 * 60 * 1000); // Refresh medals data every 5 minutes
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



function isMacOS() {
  return typeof process !== 'undefined' &&
         process.platform === 'darwin';
}

const showHideOrCreateWindow = () => {
    const wins = BrowserWindow.getAllWindows()
    if (wins.length === 0) {
        createWindow()
    } else {
        if(wins[0].isMinimized()) {
            wins[0].show()
        }else if(wins[0].isFocused()){ 
            wins[0].hide()
        }else{
            wins[0].show()
            wins[0].focus()
        }
    }
}


function showNotification () {
  new Notification({ title: 'hello', body: 'hihi' }).show()
}


const loadCurrentMedals = () => {
    fetch('https://www.olympics.com/wmr-owg2026/competition/api/FRA/medals', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Medals data loaded', data);
        let allMedals = [];
        data.medalStandings.medalsTable.forEach(country => {
            if(country.organisation === 'FRA'){
                // Load medals list fro France

                country.disciplines.forEach(someDiscipline => {
                    someDiscipline.medalWinners.forEach(someMedal => {
                        allMedals.push({
                            discipline: someDiscipline.name,
                            event: someMedal.eventDescription,
                            medalType: someMedal.medalType,
                            athlete: someMedal.competitorDisplayTvName,
                            date: someMedal.date,
                            disciplineCode: someDiscipline.code
                        })
                    })
                })

                lastMedalsLoaded = allMedals;
            }
        })
    })
    .catch(error => {
        console.error('Error loading medals data', error);
    });
}