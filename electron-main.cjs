const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Sentinel Ceasa - Guardião",
    icon: path.join(__dirname, 'public/favicon.ico'), // Opcional: ícone do app
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Em produção, carrega o index.html da pasta dist
  // Em desenvolvimento, você pode apontar para o localhost:3000
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Remove o menu superior padrão para parecer um app nativo
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
