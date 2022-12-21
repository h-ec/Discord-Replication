import { contextBridge, ipcRenderer} from "electron";

const API = {
    app: {
        close:    () => ipcRenderer.send("process/close"),
        maximize: () => ipcRenderer.send("process/maximize"),
        minimize: () => ipcRenderer.send("process/minimize"),
        reload:   () => ipcRenderer.send("process/reload"),
    },
    maximizeState: (_: string) => ipcRenderer.invoke("process/maximize-status", _),
};

contextBridge.exposeInMainWorld("process", API);