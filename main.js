const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load your React app (from build folder or local dev server)
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5173');
    }, 3000); // waits 3 seconds to let Vite start

  // or for production build:
  // mainWindow.loadFile(path.join(__dirname, 'client/dist/index.html'));

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  // Start your Express backend automatically
  exec('node server/server.js', (err, stdout, stderr) => {
    if (err) console.error('Server failed to start:', err);
    if (stderr) console.error(stderr);
    console.log(stdout);
  });

  createWindow();
});
