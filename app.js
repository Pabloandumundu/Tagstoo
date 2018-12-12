const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Hay que guardar una referencia global el objeto window, porque sino la ventana 
// se cerrará cuando el garbage collector quite esa referencia
let win

function createWindow () {


  // Crea la ventana del navegador
  win = new BrowserWindow({
    /*minWidth: 680, 
    minHeight: 220,*/
    width: 680,
    height: 400,
    center: true,
    closable: true,
    resizable: false,
    icon: "img/logo-t-120.png",
    webPreferences: {
      nodeIntegration: true
    }
  })

  // quita el menu de electron (si bien en la versión compilada ya no se ve)
  win.setMenu(null);

  // y carga página inicial
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'initialselect.html'),
    protocol: 'file:',
    slashes: true
  }))

  // abre las herramientas de desarrollador
  /*win.webContents.openDevTools({mode: 'detach'});*/

  // evento que se emite cuando la ventana se cierra
  win.on('closed', () => {
    // Quitar la referencia del objeto window, habitualmente se guardan 
    // las ventanas en un array si nuestra app tiene más de una
    win = null;
  })
}

// Este método se invoca cuando Electron finaliza la inicialización y está preparado
// para crear browser windows.
// Algunas APIs sólo se pueden usar después de que se dispare este evento.
app.on('ready', createWindow);

// Salir cuando todas las ventanas se cierran
app.on('window-all-closed', () => {
  // En macOS es habitual que la aplicación y su menú quede activo hasta que el 
  // usuario sale explícitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común recrear una ventana cuando se hace clic en el
  // icono del dock y no hay otras ventanas abiertas
  if (win === null) {
    createWindow()
  }
})

// Incluir el resto de nuestra app
// Se pueden crear ficheros separados y invocarlos con require