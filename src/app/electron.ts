import { app, BrowserWindow, BrowserWindowConstructorOptions, dialog, ipcMain, session } from 'electron';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';
import electronReload from 'electron-reload';
import path from 'path';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { ErrorConstructorClass } from './error';
import 'v8-compile-cache';
electronReload(path.join(__dirname.replace('dest', 'src/')), { ignored: path.join(__dirname, '/electron.js') });

dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
};

interface chromiumSettings 
{
    AppManifest: {
        AppIcon: string,
        Title: string,

        MinWidth: number,
        MinHeight: number,

        Width: number,
        Height: number,

        HiddenBeforeLoad: boolean,
        HiddenMenuBar?: boolean, // Default is TRUE + OPTIONAL
        UsingCustomTitleBar: boolean,
    },

    LiveApp: {
        BridgePath: string,
        ApplicationURL: string,
    },

    WebPrefrences: {
        NodeIntegration: boolean,
        ContextIsolation: boolean,
    }
}

let mainAppWindow: BrowserWindow;
const gotTheLock = app.requestSingleInstanceLock();

const createChromiumWindow = async ( ChromiumSettings: chromiumSettings ) => {
    if (!gotTheLock) {
        app.quit()
      } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainAppWindow) {
                if (mainAppWindow.isMinimized()) mainAppWindow.restore()
                mainAppWindow.focus()
            }
        })
    }

    const preformanceTimer1 = performance.now();
    if(ChromiumSettings.AppManifest?.HiddenMenuBar !== (true || false)) ChromiumSettings.AppManifest.HiddenMenuBar = true;
    if(ChromiumSettings === null) return console.log('Undefined Chromium App Settings!');
    const BrowserWindowOptions: BrowserWindowConstructorOptions = {
        icon:            ChromiumSettings.AppManifest.AppIcon,
        title:           ChromiumSettings.AppManifest.Title,
        minWidth:        ChromiumSettings.AppManifest.MinWidth,
        minHeight:       ChromiumSettings.AppManifest.MinHeight,
        width:           ChromiumSettings.AppManifest.Width,
        height:          ChromiumSettings.AppManifest.Height,
        show:            ChromiumSettings.AppManifest.HiddenBeforeLoad,
        autoHideMenuBar: ChromiumSettings.AppManifest.HiddenMenuBar,
        frame:           ChromiumSettings.AppManifest.UsingCustomTitleBar ? false : true,
        backgroundColor: '#fff',
        transparent:     true,
        webPreferences: {
            nodeIntegration:  ChromiumSettings.WebPrefrences.NodeIntegration,
            contextIsolation: ChromiumSettings.WebPrefrences.ContextIsolation,
            preload:          ChromiumSettings.LiveApp.BridgePath,
            devTools:         app.isPackaged ? false : true,
            zoomFactor:       1.0,
            v8CacheOptions:   'bypassHeatCheckAndEagerCompile',
            webviewTag:       true,
        }
    };
    const appLock = path.join(app.getPath("exe").replace('Discord.exe', ''), '/app.lock');
    if(!existsSync(appLock))
    {
        mainAppWindow = new BrowserWindow(BrowserWindowOptions);
        mainAppWindow.loadURL(ChromiumSettings.LiveApp.ApplicationURL);
        if(ChromiumSettings.AppManifest?.HiddenMenuBar)
            mainAppWindow.setAutoHideMenuBar(null as any | null);
        const beforeLoadWindowState: boolean = ChromiumSettings.AppManifest.HiddenBeforeLoad;
        console.log('Created BrowserWindow Successfully, State: %s', beforeLoadWindowState ? 'HIDDEN' : 'SHOWEN');
        if(beforeLoadWindowState)
        {
            mainAppWindow.webContents.once('did-finish-load', ( ) => {
                mainAppWindow.show();
            });
        }
        mainAppWindow.webContents.setZoomFactor(1.0);
        mainAppWindow.webContents.setVisualZoomLevelLimits(1, 1)
        .catch((err) => console.log(err));

        app.commandLine.appendSwitch('disable-pinch');
        let webContents = mainAppWindow.webContents
        webContents.on('did-finish-load', () => {
            webContents.setZoomFactor(1);
            webContents.setVisualZoomLevelLimits(1, 1);
            app.commandLine.appendSwitch('disable-pinch');
        })

        webContents.on('zoom-changed', ( ) => {
            webContents.setZoomFactor(1);
            webContents.setVisualZoomLevelLimits(1, 1);
            app.commandLine.appendSwitch('disable-pinch');
        });

        mainAppWindow.webContents.on('new-window', (event, url) => {
            event.preventDefault();
        })

        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(session.defaultSession);
        });

        const preformanceTimer2 = performance.now();
        console.log(`[PREFORMANCE] Took about ${preformanceTimer2 - preformanceTimer1}ms to finish!`)

        try {
            writeFileSync(appLock, 'LOCKED');
        }
        catch(err: ErrorConstructorClass | any)
        {
            console.log(`========================================\n[ERR] At electron.ts:170\n[ERR] Title: ${err?.title}\n${err?.message}\n========================================`)
        }
    }
    else
    {
        return;
    }
}


const hookChromiumReloadScriptable = async ( ) => {
    mainAppWindow.reload();
}

app.on('quit', ( ) => {
    app.quit();
    const file: string = path.join(app.getPath("exe").replace('Discord.exe', ''), '/app.lock');
    existsSync(file) ? unlinkSync(file) : '';
    process.exit(41);
});

app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainAppWindow) {
        if (mainAppWindow.isMinimized())
          mainAppWindow.restore();
        mainAppWindow.focus();
    }
})

ipcMain.on('process/close',    () => app.quit());
ipcMain.on('process/maximize', () => mainAppWindow.isMaximized() ? mainAppWindow.unmaximize() : mainAppWindow.maximize());
ipcMain.on('process/minimize', () => mainAppWindow.minimize());
ipcMain.on('process/reload',   () => mainAppWindow.reload());

ipcMain.handle('process/maximize-status', async (_, data) => {
    return mainAppWindow.isMaximized() ? 'MAXIMIZED' : 'NOT_MAXIMIZED';
});

export {
    chromiumSettings,
    createChromiumWindow,
    hookChromiumReloadScriptable
}