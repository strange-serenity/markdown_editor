const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('index.html');
}

// Обработчик сохранения файла
ipcMain.on('save-markdown', async (event, content) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Зберегти файл',
    defaultPath: 'markdown.md',
    filters: [{ name: 'Markdown Files', extensions: ['md'] }]
  });

  if (filePath) {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Error during save file:', err);
      } else {
        console.log('File saved!');
      }
    });
  }
});

// Обработчик загрузки файла
ipcMain.on('load-markdown', async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Завантажити файл',
    filters: [{ name: 'Markdown Files', extensions: ['md'] }],
    properties: ['openFile']
  });

  if (filePaths && filePaths[0]) {  // Проверка, что файл выбран
    fs.readFile(filePaths[0], 'utf8', (err, data) => {
      if (err) {
        console.error('Error during load file:', err);
      } else {
        event.sender.send('file-loaded', data);  // Отправляем содержимое файла обратно в renderer.js
      }
    });
  }
});

app.on('ready', createWindow);
