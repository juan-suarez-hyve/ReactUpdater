import { app, BrowserWindow, DownloadItem, ipcMain, ipcRenderer} from 'electron';
import { autoUpdater, AppUpdater, UpdaterEvents} from 'electron-updater';
import {updateElectronApp, UpdateSourceType} from 'update-electron-app';
import * as path from 'path';
import fs from 'fs';
import log from "electron-log";
import { exec, ExecException, ExecOptions } from 'child_process';
import isElevated from 'is-elevated';
import { Update } from 'vite';
import { Notification } from "electron";

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if(process.platform === 'win32') {
  try{
    require('electron-squirrel-startup')
  }catch(e){
    console.log("electron-squirrel-startup is not available on macOS, ignoring...")
  }
}



log.transports.file.resolvePathFn = () => path.join(app.getPath("userData"), "logs/main.log");

log.transports.console.level = "info";
log.debug("App starting...");

console.log("Hello from main.js");

if (!app.isPackaged) {
  //autoUpdater.allowPrerelease = true;
  //autoUpdater.allowDowngrade = true;
  //autoUpdater.forceDevUpdateConfig = true; // Forzar la configuración de desarrollo
}

async function restartWithoutAdmin() {
  const elevated = await isElevated();
  if (elevated) {
      console.log('La aplicación se está ejecutando como administrador. Reiniciando sin privilegios...');
      
      exec(`powershell -Command "Start-Process '${process.execPath}' -Verb RunAs"`, (error) => {
          if (error) {
              console.error('Error al reiniciar sin privilegios:', error);
          }
          app.quit();
      });
  }
}

autoUpdater.autoDownload = true; // Descarga automáticamente las actualizaciones
autoUpdater.autoInstallOnAppQuit = true; // Instala al cerrar la app
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'hyve-innovate',
  repo: 'hyve-icons-app',
  token: process.env.GITHUB_TOKEN
});

log.info("App started");
let mainWindow: BrowserWindow;
function createWindow (){
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 850,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    //resizable: false, // Desactiva el redimensionamiento de la ventana
    frame: true, // Deja el marco de la ventana (puedes usar 'false' si no deseas el borde)
    movable: true,

  });
  

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 1*60*1000)

};

ipcMain.on('ondragstart', (event: {
    sender: {
      startDrag: (arg0: {
        file: string; icon: string; // Usamos la ruta resuelta para el icono
      }) => void;
    };
  }, fileName: string, file: string | NodeJS.ArrayBufferView<ArrayBufferLike>) => {
  const filePath = path.join(app.getPath("temp"), fileName + ".svg")

  file = "<?xml version='1.0' encoding='UTF-8' standalone='no'?>" + file

  try { 
    fs.writeFileSync(filePath, file, 'utf-8')
  } catch(e) { 
    console.error("Error saving the SVG file:", e);
    return;
  }

  // Verificamos la ruta correcta con path.resolve
  const iconPath = path.join(app.getAppPath(), 'public', 'assets', 'images', 'drag.png');
  
  // Enviamos la señal para iniciar el drag
  event.sender.startDrag({
    file: filePath,
    icon: iconPath  // Usamos la ruta resuelta para el icono
  });
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

restartWithoutAdmin().then(() => {
  app.whenReady().then(() => {
    createWindow();
  });

});

ipcMain.on('check-for-updates', () => {
  console.log("Checking for updates...");
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', (info) => {
  console.log('update available:', info.version);
  console.log('url:', info.files);
  mainWindow.webContents.send('update_available');
});
let isdownloaded: boolean = false;
ipcMain.on('download-update', () => {
  console.log("Descargando actualización...");
  try{
    autoUpdater.downloadUpdate().then(() => {
      console.log("Actualización descargada correctamente");
      isdownloaded = true;
    }).catch((error) => {
      console.error("Error al descargar la actualización:", error);
    });
  }catch (e){
    console.log("error: ", e);
  }
  
});

// Escuchar el evento para instalar la actualización
ipcMain.on('install-update', () => {
  console.log("Instalando actualización...");
  if (isdownloaded) {
    autoUpdater.quitAndInstall();
  } else {
    console.error("No hay una actualización descargada para instalar");
  }
});

autoUpdater.on('download-progress', (progress) =>{
  console.log('download progresing:', progress.bytesPerSecond);

  mainWindow.webContents.send('download-progress', progress);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Actualizacion descargada', info.downloadedFile);
  mainWindow.webContents.send('update_downloaded');
  new Notification({
    title: "Actualización lista",
    body: "Haz clic para reiniciar e instalar",
  }).show();
});



ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (error) => {
  console.error('Error en el proceso de actualización:', error);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.