import express, { Request, Response, Router } from 'express';
import { router } from './router/router';
import path from 'path';
import { app } from 'electron';
import { createChromiumWindow } from './electron';
import { createConnectionTest } from './router/mongo-db';

(async ( ) => {
    const ExpressApp = express();
    ExpressApp.use(router);
    ExpressApp.use(express.json({ limit: '2048kb' }));
    ExpressApp.use(express.urlencoded({ extended: true }));
    ExpressApp.set('view engine', 'ejs');
    ExpressApp.set('views', path.join(__dirname.replace('src\\app', 'src'), '/discord_native/views'));
    ExpressApp.use(express.static(path.join(__dirname.replace('src\\app', 'src'), '/discord_native')));
    ExpressApp.listen(7575, ( ) => console.log('A connection has been created!'));
    createConnectionTest();
    app.whenReady().then(( ) => createChromiumWindow({
        AppManifest: {
            MinWidth: 900,
            MinHeight: 600,
            Width: 1280,
            Height: 720,
            AppIcon: path.join(__dirname, '/discord.png'),
            Title: 'Discord',
            UsingCustomTitleBar: true,
            HiddenBeforeLoad: true,
        },
        LiveApp: {
            ApplicationURL: 'http://localhost:7575',
            BridgePath: path.join(__dirname, '/bridge.js'),
        },
        WebPrefrences: {
            ContextIsolation: true,
            NodeIntegration: true,
        }
    })).then(( ) => console.log('Done creating chromium window!'));
})();