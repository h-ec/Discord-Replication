"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./router/router");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_2 = require("./electron");
const mongo_db_1 = require("./router/mongo-db");
(async () => {
    const ExpressApp = (0, express_1.default)();
    ExpressApp.use(router_1.router);
    ExpressApp.use(express_1.default.json({ limit: '2048kb' }));
    ExpressApp.use(express_1.default.urlencoded({ extended: true }));
    ExpressApp.set('view engine', 'ejs');
    ExpressApp.set('views', path_1.default.join(__dirname.replace('src\\app', 'src'), '/discord_native/views'));
    ExpressApp.use(express_1.default.static(path_1.default.join(__dirname.replace('src\\app', 'src'), '/discord_native')));
    ExpressApp.listen(7575, () => console.log('A connection has been created!'));
    (0, mongo_db_1.createConnectionTest)();
    electron_1.app.whenReady().then(() => (0, electron_2.createChromiumWindow)({
        AppManifest: {
            MinWidth: 900,
            MinHeight: 600,
            Width: 1280,
            Height: 720,
            AppIcon: path_1.default.join(__dirname, '/discord.png'),
            Title: 'Discord',
            UsingCustomTitleBar: true,
            HiddenBeforeLoad: true,
        },
        LiveApp: {
            ApplicationURL: 'http://localhost:7575',
            BridgePath: path_1.default.join(__dirname, '/bridge.js'),
        },
        WebPrefrences: {
            ContextIsolation: true,
            NodeIntegration: true,
        }
    })).then(() => console.log('Done creating chromium window!'));
})();
