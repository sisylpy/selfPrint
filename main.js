const { app, BrowserWindow, screen, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const { mouse, keyboard, Key } = require("@nut-tree/nut-js");
const paperSize = { width: 241.3, height: 139.7 }; // 纸张尺寸以英寸为单位

// 这里加载 FFmpeg 相关的 DLL 文件
const ffmpegPath = path.join(__dirname, 'resources/ffmpeg.dll')
const avcodecPath = path.join(__dirname, 'resources/avcodec-61.dll')
const avutilPath = path.join(__dirname, 'resources/avutil-59.dll')
const avformatPath = path.join(__dirname, 'resources/avformat-61.dll')
const avdevicePath = path.join(__dirname, 'resources/avdevice-61.dll')


// 确保这些路径正确加载
console.log(`FFmpeg loaded from: ${ffmpegPath}`)
console.log(`avcodec loaded from: ${avcodecPath}`)
console.log(`avutil loaded from: ${avutilPath}`)
console.log(`avformat loaded from: ${avformatPath}`)
console.log(`avdevice loaded from: ${avdevicePath}`)


let win;

  
function createWindow() {
  console.log('当前环境:', process.env.NODE_ENV);

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'dist','preload.js'),  // 加载 preload 脚本
      nodeIntegration: false, // Enable Node.js integration
      contextIsolation: true, // Disable context isolation
      allowRunningInsecureContent: true,  // 允许加载本地内容
    }
  });

  // win.loadFile(path.join(__dirname, 'dist', 'index.html'));  // 确保路径正确

  if (process.env.NODE_ENV === 'development') {
    // 开发模式：加载 Vite 提供的热更新服务
    win.loadURL('http://localhost:5173');
  } else {
    // 生产模式：加载打包后的 Vue 应用 HTML 文件
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));  // 确保路径正确
  }

  // 打开 DevTools
  win.webContents.openDevTools();
  
  // 启动时监听 Vue 页面请求打印
  // ipcMain.on('print-request', (event, printData) => {
  //   printContentToWindow(printData);
  // });
}
// /////

ipcMain.on('print-request', (event, printContent) => {
  // 在这里处理打印请求
  printContentToWindow(printContent);
});

function printContentToWindow(printContent) {
  const printWindow = new BrowserWindow({
    show: false,  // 不显示打印窗口
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(printContent));

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({}, (success, error) => {
      if (success) {
        console.log('打印成功');
      } else {
        console.log('打印失败', error);
      }
    });
  });
}



app.whenReady().then(() => {
  createWindow();
// 监听来自渲染进程的 IPC 消息
ipcMain.on('trigger-enter-key', () => {
  // robot.keyTap('enter');
  keyboard.pressKey(Key.Enter);
keyboard.releaseKey(Key.Enter);
  
});


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
