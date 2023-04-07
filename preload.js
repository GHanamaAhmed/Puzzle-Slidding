const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('versions', {
  close: () => ipcRenderer.invoke('ping'),
  a: (start, goal) => ipcRenderer.invoke('A', { start: start, goal: goal }),
  l: (start, goal) => ipcRenderer.invoke('L', { start: start, goal: goal }),
  p: (start, goal, nDepth) => ipcRenderer.invoke('P', { start: start, goal: goal, depth: nDepth }),
})