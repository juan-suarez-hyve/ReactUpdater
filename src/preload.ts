// See the Electron documentation for details on how to use preload scripts:
//https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer } from 'electron';
import { updateElectronApp } from 'update-electron-app';

console.log("ejecutando preload.ts");

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, ...args: []) => ipcRenderer.send(channel, ...args),
  receive: (channel: string, func: Function) => ipcRenderer.on(channel, (event: any, ...args: any) => func(...args)),
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
  },

  checkForUpdates: () => {
    console.log('🛠 checkForUpdates llamado desde renderer')
    ipcRenderer.send("check-for-updates");
  },
  downloadUpdate: () => {
    ipcRenderer.send("download-update");
  },
  updateElectronApp: () => {
    console.log('🛠 checkForUpdates llamado desde renderer');
    ipcRenderer.send("update-available");
  },
  installUpdate: () => {
    console.log("Installing");
    ipcRenderer.send("install-update");
  },
  onUpdateAvailable: (callback: (version: string) => void) => ipcRenderer.on("update-available", (_: any, version: string) => callback(version)),

  onUpdateDownloaded: (callback: () => void) => {
    console.log("update is downloaded");
    ipcRenderer.on("update-downloaded", callback);
  },
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: any, text: any) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  
})