// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');
const { keyboard, Key } = require('@nut-tree/nut-js');  // 引入 nut-js 来模拟键盘操作

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  sendPrintRequest: (printData) => ipcRenderer.send('print-request', printData), // 发送打印请求
  triggerEnterKey: () => {
    // 触发 Enter 键的代码，例如模拟按下 Enter 键
    keyboard.pressKey(Key.Enter);
    keyboard.releaseKey(Key.Enter);
  },
  os: {
    platform: () => os.platform(),
    arch: () => os.arch(),
  }
});
