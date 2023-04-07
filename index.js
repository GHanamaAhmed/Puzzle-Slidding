const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const {
    Worker
} = require('node:worker_threads');
app.disableHardwareAcceleration()
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        minWidth: 800,
        minHeight: 700,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "src/assets/number-puzzle.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadFile(path.join(__dirname, "src", "index.html"))
    // win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('ping', () => { app.quit() })
ipcMain.handle("A", (evt, { start, goal }) => {
    return new Promise((resolve, reject) => {
        const longProcess = new Worker("./game.js")
        longProcess.postMessage({ start, goal, depth: null, algorithme: "A" })
        longProcess.on("message", (data) => {
            console.log(data);
            resolve(data)
        })
        longProcess.on("error", (err) => {
            reject(err)
        })
    })

})
ipcMain.handle("L", (evt, { start, goal }) => {
    return new Promise((resolve, reject) => {
        const longProcess = new Worker("./game.js")
        longProcess.postMessage({ start, goal, depth: null, algorithme: "L" })
        longProcess.on("message", (data) => {
            console.log(data);
            resolve(data)
        })
        longProcess.on("error", (err) => {
            reject(err)
        })
    })

})
ipcMain.handle("P", (evt, { start, goal, depth }) => {
    return new Promise((resolve, reject) => {
        const longProcess = new Worker("./game.js")
        longProcess.postMessage({ start, goal, depth, algorithme: "P" })
        longProcess.on("message", (data) => {
            console.log(data);
            resolve(data)
        })
        longProcess.on("error", (err) => {
            reject(err)
        })
    })

})