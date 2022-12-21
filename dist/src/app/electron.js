"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookChromiumReloadScriptable = exports.createChromiumWindow = void 0;
const electron_1 = require("electron");
const adblocker_electron_1 = require("@cliqz/adblocker-electron");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const electron_reload_1 = __importDefault(require("electron-reload"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
require("v8-compile-cache");
(0, electron_reload_1.default)(path_1.default.join(__dirname.replace('dest', 'src/')), { ignored: path_1.default.join(__dirname, '/electron.js') });
electron_1.dialog.showErrorBox = function (title, content) {
    console.log(`${title}\n${content}`);
};
let mainAppWindow;
const gotTheLock = electron_1.app.requestSingleInstanceLock();
const createChromiumWindow = async (ChromiumSettings) => {
    if (!gotTheLock) {
        electron_1.app.quit();
    }
    else {
        electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainAppWindow) {
                if (mainAppWindow.isMinimized())
                    mainAppWindow.restore();
                mainAppWindow.focus();
            }
        });
    }
    const preformanceTimer1 = performance.now();
    if (ChromiumSettings.AppManifest?.HiddenMenuBar !== (true || false))
        ChromiumSettings.AppManifest.HiddenMenuBar = true;
    if (ChromiumSettings === null)
        return console.log('Undefined Chromium App Settings!');
    const BrowserWindowOptions = {
        icon: ChromiumSettings.AppManifest.AppIcon,
        title: ChromiumSettings.AppManifest.Title,
        minWidth: ChromiumSettings.AppManifest.MinWidth,
        minHeight: ChromiumSettings.AppManifest.MinHeight,
        width: ChromiumSettings.AppManifest.Width,
        height: ChromiumSettings.AppManifest.Height,
        show: ChromiumSettings.AppManifest.HiddenBeforeLoad,
        autoHideMenuBar: ChromiumSettings.AppManifest.HiddenMenuBar,
        frame: ChromiumSettings.AppManifest.UsingCustomTitleBar ? false : true,
        backgroundColor: '#fff',
        transparent: true,
        webPreferences: {
            nodeIntegration: ChromiumSettings.WebPrefrences.NodeIntegration,
            contextIsolation: ChromiumSettings.WebPrefrences.ContextIsolation,
            preload: ChromiumSettings.LiveApp.BridgePath,
            devTools: electron_1.app.isPackaged ? false : true,
            zoomFactor: 1.0,
            v8CacheOptions: 'bypassHeatCheckAndEagerCompile',
            webviewTag: true,
        }
    };
    const appLock = path_1.default.join(electron_1.app.getPath("exe").replace('Discord.exe', ''), '/app.lock');
    if (!(0, fs_1.existsSync)(appLock)) {
        mainAppWindow = new electron_1.BrowserWindow(BrowserWindowOptions);
        mainAppWindow.loadURL(ChromiumSettings.LiveApp.ApplicationURL);
        if (ChromiumSettings.AppManifest?.HiddenMenuBar)
            mainAppWindow.setAutoHideMenuBar(null);
        const beforeLoadWindowState = ChromiumSettings.AppManifest.HiddenBeforeLoad;
        console.log('Created BrowserWindow Successfully, State: %s', beforeLoadWindowState ? 'HIDDEN' : 'SHOWEN');
        if (beforeLoadWindowState) {
            mainAppWindow.webContents.once('did-finish-load', () => {
                mainAppWindow.show();
            });
        }
        mainAppWindow.webContents.setZoomFactor(1.0);
        mainAppWindow.webContents.setVisualZoomLevelLimits(1, 1)
            .catch((err) => console.log(err));
        electron_1.app.commandLine.appendSwitch('disable-pinch');
        let webContents = mainAppWindow.webContents;
        webContents.on('did-finish-load', () => {
            webContents.setZoomFactor(1);
            webContents.setVisualZoomLevelLimits(1, 1);
            electron_1.app.commandLine.appendSwitch('disable-pinch');
        });
        webContents.on('zoom-changed', () => {
            webContents.setZoomFactor(1);
            webContents.setVisualZoomLevelLimits(1, 1);
            electron_1.app.commandLine.appendSwitch('disable-pinch');
        });
        mainAppWindow.webContents.on('new-window', (event, url) => {
            event.preventDefault();
        });
        adblocker_electron_1.ElectronBlocker.fromPrebuiltAdsAndTracking(cross_fetch_1.default).then((blocker) => {
            blocker.enableBlockingInSession(electron_1.session.defaultSession);
        });
        const preformanceTimer2 = performance.now();
        console.log(`[PREFORMANCE] Took about ${preformanceTimer2 - preformanceTimer1}ms to finish!`);
        try {
            (0, fs_1.writeFileSync)(appLock, 'LOCKED');
        }
        catch (err) {
            console.log(`========================================\n[ERR] At electron.ts:170\n[ERR] Title: ${err?.title}\n${err?.message}\n========================================`);
        }
    }
    else {
        return;
    }
};
exports.createChromiumWindow = createChromiumWindow;
const hookChromiumReloadScriptable = async () => {
    mainAppWindow.reload();
};
exports.hookChromiumReloadScriptable = hookChromiumReloadScriptable;
electron_1.app.on('quit', () => {
    electron_1.app.quit();
    const file = path_1.default.join(electron_1.app.getPath("exe").replace('Discord.exe', ''), '/app.lock');
    (0, fs_1.existsSync)(file) ? (0, fs_1.unlinkSync)(file) : '';
    process.exit(41);
});
electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainAppWindow) {
        if (mainAppWindow.isMinimized())
            mainAppWindow.restore();
        mainAppWindow.focus();
    }
});
electron_1.ipcMain.on('process/close', () => electron_1.app.quit());
electron_1.ipcMain.on('process/maximize', () => mainAppWindow.isMaximized() ? mainAppWindow.unmaximize() : mainAppWindow.maximize());
electron_1.ipcMain.on('process/minimize', () => mainAppWindow.minimize());
electron_1.ipcMain.on('process/reload', () => mainAppWindow.reload());
electron_1.ipcMain.handle('process/maximize-status', async (_, data) => {
    return mainAppWindow.isMaximized() ? 'MAXIMIZED' : 'NOT_MAXIMIZED';
});
