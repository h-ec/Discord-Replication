import fs from "fs";
import path from "path";

function copyFileSync( source: string, target: string ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source: string, target: string ) {
    var files: any = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file: any ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

copyFolderRecursiveSync(path.join(__dirname + "/src/discord_native/"), path.join(__dirname + "/dist/src/"));
console.log(`Done copying /src/discord_native/ to /dist/src/discord_native/ [100%]`);

let _file: any = [];
let _file_length: any = [];

let num = 0;
fs.readdirSync(path.join(__dirname, "/src/discord_native/views")).forEach(( e ) => {
    _file.push(fs.readFileSync(path.join(__dirname, "/src/discord_native/views/" + e)));
    _file_length.push(num);   
    num++;
});

let file_contents: any = [];

setInterval(( ) => {
    fs.readdirSync(path.join(__dirname + "/src/discord_native/views")).forEach(( e ) => {
        file_contents.push(fs.readFileSync(path.join(__dirname + "/src/discord_native/views/" + e)).length);
        if(num !== e.length)
        {
            copyFolderRecursiveSync(path.join(__dirname + "/src/discord_native/"), path.join(__dirname + "/dist/src"));
        }
        fs.stat(path.join(__dirname + "/src/discord_native/views" + e), ( err: any, stats: any ) => {
            if(err) { }
            console.clear();
            copyFolderRecursiveSync(path.join(__dirname + "/src/discord_native/"), path.join(__dirname + "/dist/src"));
        });
    });
}, 256);