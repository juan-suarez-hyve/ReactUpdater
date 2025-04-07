/*import '../src/index.css';
import HyperList from 'hyperlist';
import { coloris, init } from '@melloware/coloris';
import '@melloware/coloris/dist/coloris.css';
import { iconManager} from './iconManager';
import { UploadProgress } from 'electron';
import { ProgressInfo } from 'electron-updater';
import { CurrentIconColor } from './models/currentIconColor';



const observerCurrentIconColor = new CurrentIconColor();


let filtered: boolean = false;


const updateIcon = document.getElementById('update-icon');
const updateModal = document.getElementById('update-modal');
const restartNowBtn = document.getElementById('restart-now');
const restartLaterBtn = document.getElementById('restart-later');

updateIcon.style.display = 'none';




document.addEventListener('DOMContentLoaded', () => {
  const iconBox = document.getElementById('icons-box');
  const mainDiv = document.getElementById('main');
  const searchIcons = document.getElementById('searchterm') as HTMLInputElement
  const clearButton = document.getElementById('clear')
  const colorPicker = document.getElementById('color') as HTMLInputElement
  const iconManagerInstance = new iconManager(iconBox, observerCurrentIconColor); //usar para desacoplar las funciones de obtencion de iconos
  observerCurrentIconColor.addObserver(iconManagerInstance);
  observerCurrentIconColor.setState("#000000");

  if (!iconBox || !searchIcons || !colorPicker) {
    console.error("Elements Not found!")
    return
  }
  if (window.electronAPI) {

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    console.log("electronAPI is defined:", window.electronAPI);
    window.electronAPI.onUpdateAvailable(() => {
      console.log("si hay actualizacion")
    });

    window.electronAPI.receive('update-available', () => {
      console.log('Actualización disponible');
      //updateIcon.style.display = 'block'; 
    });
    
    window.electronAPI.receive('update_downloaded', () => {
      console.log('Actualización descargada');
      
      setInterval(() => {
        updateIcon.style.opacity = updateIcon.style.opacity === '0.5' ? '1' : '0.5';
      }, 500);
    });

    window.electronAPI.receive('download-progress', (progress: ProgressInfo) => {
      console.log('download-progressing:', progress);
      if (progressBar && progressText) {
        progressBar.style.width = `${progress.percent}%`;
        progressText.innerText = `${progress.percent.toFixed(2)}% (${formatBytes(progress.transferred)} / ${formatBytes(progress.total)})`;
      }
    });
    

    function formatBytes(bytes: number, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
    
    updateIcon.addEventListener('click', (event:MouseEvent) => {
      updateModal.style.display = 'block'; 
    });
    
    // actualizar ahora
    restartNowBtn.addEventListener('click', (event:MouseEvent) => {
      console.log("Start Downloading....")
      progressText.style.display = 'block'
      window.electronAPI.downloadUpdate();
      window.electronAPI.installUpdate();
      window.electronAPI.send('restart_app'); // Enviar evento al proceso principal para reiniciar
    });
    
    // actualizar más tarde
    restartLaterBtn.addEventListener('click', () => {
      updateModal.style.display = 'none'; 
    }); 

  }else{
    console.error("electronAPI is undefined");
  }
  


  function lightOrDark(color: string): 'light' | 'dark' {

    if (color.startsWith('#')) {
      color = color.slice(1)
    }

    const r = parseInt(color.slice(0, 2), 16)
    const g = parseInt(color.slice(2, 4), 16)
    const b = parseInt(color.slice(4, 6), 16)
    const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255
    return luminance > 0.6 ? 'light' : 'dark'
  }
  

  observerCurrentIconColor.setState(localStorage.getItem('color') || "#000000"); //set color to observer

  colorPicker.value = observerCurrentIconColor.getState();
  colorPicker.style.color = observerCurrentIconColor.getState();

  document.querySelector('#favorites-toggle').addEventListener('click', (event: MouseEvent) => {
    if(event.target instanceof HTMLInputElement){
      filtered = event.target.checked;
      iconManagerInstance.setFiltered(filtered);
      iconManagerInstance.loadIcons(searchIcons.value);
    }
  })

  function updateColor(isLight: boolean) {
    document.body.style.backgroundColor = isLight ? '#333' : '#fff'
    iconBox.style.backgroundColor = isLight ? '#555' : '#fff'
    mainDiv.style.backgroundColor = isLight ? '#555' : '#fff'
    document.querySelectorAll('body').forEach((element) => {
      element.style.color = isLight ? '#fff' : '#333'
    })
  }

  if (searchIcons.form) {
    searchIcons.form.addEventListener('submit', (event) => {
      event.preventDefault()
    });
  }

  searchIcons.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  });

  searchIcons.addEventListener('input', () => {
    iconManagerInstance.loadIcons(searchIcons.value)
  });

  clearButton.addEventListener('click', () => {
    searchIcons.value = '';
    iconManagerInstance.loadIcons('')
  });

  document.addEventListener('coloris:pick', event => {
    observerCurrentIconColor.setState((event as CustomEvent).detail.color);
    localStorage.setItem('color', observerCurrentIconColor.getState())
    iconManagerInstance.loadIcons(searchIcons.value)
    updateColor(lightOrDark(observerCurrentIconColor.getState()) === 'light')
  })

  iconManagerInstance.loadIcons('');
  updateColor(lightOrDark(observerCurrentIconColor.getState()) === 'light')
  init()

  coloris({
    el: '.coloris',
    alpha: true,
    focusInput: false,
    theme: 'large',
    themeMode: 'light',
    wrap: true,
    rtl: false,
    margin: 2,
    format: 'hex',
    closeButton: true,
    defaultColor: observerCurrentIconColor.getState(),
    swatches: ['#000000', '#FFFFFF', '#393397', '#877EFC'],
  })

  searchIcons.focus()

  document.addEventListener('keydown', (event) => {
    if (event.key === 'f' && event.ctrlKey || event.key === 'f3') {
      const search = document.getElementById('searchterm') as HTMLInputElement
      if (search) {
        search.focus()
      }
    }
  })
});*/
