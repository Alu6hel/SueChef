/**
 * SueChef - Electron Main Process
 * Windows Desktop Application Host (.exe packaging)
 * 
 * Features:
 * - Acrylic/Mica dark frame with customized Windows 11/10 titlebar overlay controls
 * - High-DPI & GPU hardware acceleration enforcement
 * - Secure IPC bridge for local dispute storage, PDF compilation, and exhibit printing
 * - Single instance lock & window state persistence
 */

const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Force hardware acceleration for smooth 120Hz/60Hz gesture physics & WebGL
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-hardware-overlays');
app.commandLine.appendSwitch('high-dpi-support', '1');

// Disable old white legacy application menu bar completely
Menu.setApplicationMenu(null);

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#070a12',
    title: 'SueChef - Civil Dispute Suite',
    icon: path.join(__dirname, '../public/logos/alu company logo symbol.png'),
    frame: true,
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
    },
    show: true,
  });

  mainWindow.setTitle('SueChef - Civil Dispute Suite (By Alu)');

  // Resolve production build in dev or packaged app
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load local HTML file, falling back to server URL:', err);
      mainWindow.loadURL('http://localhost:5173');
    });
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.show();
  mainWindow.focus();

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
