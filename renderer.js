const { marked } = require('marked');
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const preview = document.getElementById('preview');
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');

  // Обновление предпросмотра при изменении текста
  editor.addEventListener('input', () => {
    const markdownText = editor.value;
    preview.innerHTML = marked(markdownText);
  });

  // Сохранение Markdown файла
  saveButton.addEventListener('click', () => {
    const markdownText = editor.value;
    ipcRenderer.send('save-markdown', markdownText);
  });

  // Логика загрузки Markdown файла
  loadButton.addEventListener('click', () => {
    ipcRenderer.send('load-markdown');
  });

  // Получение содержимого файла и отображение его в редакторе
  ipcRenderer.on('file-loaded', (event, content) => {
    editor.value = content;
    preview.innerHTML = marked(content);  // Показываем содержимое файла в режиме предпросмотра
  });
});
