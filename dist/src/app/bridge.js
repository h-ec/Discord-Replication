"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const API = {
    app: {
        close: () => electron_1.ipcRenderer.send("process/close"),
        maximize: () => electron_1.ipcRenderer.send("process/maximize"),
        minimize: () => electron_1.ipcRenderer.send("process/minimize"),
        reload: () => electron_1.ipcRenderer.send("process/reload"),
    },
    maximizeState: (_) => electron_1.ipcRenderer.invoke("process/maximize-status", _),
};
electron_1.contextBridge.exposeInMainWorld("process", API);
