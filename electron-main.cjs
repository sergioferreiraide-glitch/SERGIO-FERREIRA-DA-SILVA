const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Sentinel Ceasa - Guardião",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Tenta carregar o ícone se existir
  const iconPath = path.join(__dirname, 'dist/icon.svg');
  if (require('fs').existsSync(iconPath)) {
    win.setIcon(iconPath);
  }

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // Em produção, usa o caminho relativo correto
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Remove o menu superior
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
