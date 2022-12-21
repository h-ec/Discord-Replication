"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function copyFileSync(source, target) {
    var targetFile = target;
    // If target is a directory, a new file with the same name will be created
    if (fs_1.default.existsSync(target)) {
        if (fs_1.default.lstatSync(target).isDirectory()) {
            targetFile = path_1.default.join(target, path_1.default.basename(source));
        }
    }
    fs_1.default.writeFileSync(targetFile, fs_1.default.readFileSync(source));
}
function copyFolderRecursiveSync(source, target) {
    var files = [];
    // Check if folder needs to be created or integrated
    var targetFolder = path_1.default.join(target, path_1.default.basename(source));
    if (!fs_1.default.existsSync(targetFolder)) {
        fs_1.default.mkdirSync(targetFolder);
    }
    // Copy
    if (fs_1.default.lstatSync(source).isDirectory()) {
        files = fs_1.default.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path_1.default.join(source, file);
            if (fs_1.default.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            }
            else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
copyFolderRecursiveSync(path_1.default.join(__dirname + "/src/discord_native/"), path_1.default.join(__dirname + "/dist/src/"));
console.log(`Done copying /src/discord_native/ to /dist/src/discord_native/ [100%]`);
let _file = [];
let _file_length = [];
let num = 0;
fs_1.default.readdirSync(path_1.default.join(__dirname, "/src/discord_native/views")).forEach((e) => {
    _file.push(fs_1.default.readFileSync(path_1.default.join(__dirname, "/src/discord_native/views/" + e)));
    _file_length.push(num);
    num++;
});
let file_contents = [];
setInterval(() => {
    fs_1.default.readdirSync(path_1.default.join(__dirname + "/src/discord_native/views")).forEach((e) => {
        file_contents.push(fs_1.default.readFileSync(path_1.default.join(__dirname + "/src/discord_native/views/" + e)).length);
        if (num !== e.length) {
            copyFolderRecursiveSync(path_1.default.join(__dirname + "/src/discord_native/"), path_1.default.join(__dirname + "/dist/src"));
        }
        fs_1.default.stat(path_1.default.join(__dirname + "/src/discord_native/views" + e), (err, stats) => {
            if (err) { }
            console.clear();
            copyFolderRecursiveSync(path_1.default.join(__dirname + "/src/discord_native/"), path_1.default.join(__dirname + "/dist/src"));
        });
    });
}, 256);
