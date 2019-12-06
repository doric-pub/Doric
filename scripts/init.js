var fs = require('fs');
var path = require('path')

require('shelljs/global')

const targetJSPath = `${__dirname}/../target/js`
const targetAndroidPath = `${__dirname}/../target/android`
const targetiOSPath = `${__dirname}/../target/iOS`

function copyFile(srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function (ex) {
        cb && cb(ex)
    })

    rs.pipe(ws)
}

function copyFolder(srcDir, tarDir, cb) {
    fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
            ++count == files.length && cb && cb()
        }

        if (err) {
            checkEnd()
            return
        }

        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)

            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    fs.mkdir(tarPath, function (err) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        copyFolder(srcPath, tarPath, checkEnd)
                    })
                } else {
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })
        files.length === 0 && cb && cb()
    })
}

function initJS(path, name) {
    if (fs.existsSync(path)) {
        console.warn(`Dir:${process.cwd()}/${path} already exists`)
        return;
    }
    fs.mkdir(path, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(`create dir ${path} success`);
        fs.writeFileSync(`${path}/package.json`, fs.readFileSync(`${targetJSPath}/_package.json`).toString().replace(/__\$__/g, name))
        fs.writeFileSync(`${path}/tsconfig.json`, fs.readFileSync(`${targetJSPath}/_tsconfig.json`))
        fs.writeFileSync(`${path}/rollup.config.js`, fs.readFileSync(`${targetJSPath}/_rollup.config.js`))
        fs.writeFileSync(`${path}/.gitignore`, fs.readFileSync(`${targetJSPath}/_gitignore`))
        fs.mkdirSync(`${path}/.vscode`)
        fs.writeFileSync(`${path}/.vscode/launch.json`, fs.readFileSync(`${targetJSPath}/_launch.json`).toString().replace(/__\$__/g, name))
        fs.writeFileSync(`${path}/.vscode/tasks.json`, fs.readFileSync(`${targetJSPath}/_tasks.json`).toString().replace(/__\$__/g, name))
        fs.mkdirSync(`${path}/src`)
        fs.writeFileSync(`${path}/src/${name}.ts`, fs.readFileSync(`${targetJSPath}/$.ts`).toString().replace(/__\$__/g, name))
        fs.writeFileSync(`${path}/index.ts`, `export default ['src/${name}']`)
        exec(`cd ${path} && npm install && npm run build`, () => {
            console.log(`Create Doric JS Project Success`)
        })
    })
}
function initAndroid(path, name) {
    if (fs.existsSync(path)) {
        console.warn(`Dir:${process.cwd()}/${path} already exists`)
        return;
    }
    console.log(`create dir ${path} success`);
    fs.mkdir(path, function (err) {
        if (err) {
            return console.error(err);
        }
        copyFolder(`${targetAndroidPath}`, `${path}`, () => {
            const mainFiles = `app/src/main/java/pub/doric/example/MainActivity.java`
            fs.writeFileSync(`${path}/${mainFiles}`, fs.readFileSync(`${targetAndroidPath}/${mainFiles}`).toString().replace(/__\$__/g, name))
            console.log(`Create Doric Android Project Success`)
        })
    })
}
function initiOS(path, name) {
    if (fs.existsSync(path)) {
        console.warn(`Dir:${process.cwd()}/${path} already exists`)
        return;
    }
    console.log(`create dir ${path} success`);
    fs.mkdir(path, function (err) {
        if (err) {
            return console.error(err);
        }
        copyFolder(`${targetiOSPath}`, `${path}`, () => {
            const mainFiles = `Example/ViewController.m`
            fs.writeFileSync(`${path}/${mainFiles}`, fs.readFileSync(`${targetiOSPath}/${mainFiles}`).toString().replace(/__\$__/g, name))
            console.log(`Create Doric iOS Project Success`)
        })
    })
}
module.exports = function (name) {
    if (fs.existsSync(name)) {
        console.warn(`Dir:${process.cwd()}/${name} already exists`)
        return;
    }
    fs.mkdir(name, function (err) {
        if (err) {
            return console.error(err);
        }
        initJS(`${process.cwd()}/${name}/js`, name)
        initAndroid(`${process.cwd()}/${name}/android`, name)
        initiOS(`${process.cwd()}/${name}/iOS`, name)
    })
}