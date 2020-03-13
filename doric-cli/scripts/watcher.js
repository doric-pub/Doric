const chokidar = require('chokidar')
const ws = require('./server')
const fs = require("fs")
const doMerge = require("./command").doMerge

require('shelljs/global')

exec('npm run dev >/dev/null 2>&1', { async: true })
console.warn('Waiting ...')
setTimeout(() => {
    console.warn('Start watching')
    ws.listen(7777)
    chokidar.watch(process.cwd() + "/bundle", {
        ignored: /(^|[\/\\])\../,
    }).on('change', (path) => {
        if (ws.debugging) {
            console.log("debugging, hot reload by pass")
            return
        }
        fs.readFile(path, 'utf-8', (error, data) => {
            if (!path.endsWith('.map')) {
                try {
                    const sourceMap = doMerge(path + ".map")
                    ws.connections.forEach(e => {
                        e.sendText(JSON.stringify({
                            cmd: 'RELOAD',
                            script: data,
                            source: path.match(/[^/\\]*$/)[0],
                            sourceMap,
                        }))
                    })
                } catch (e) {
                    console.error(e)
                }
            }
        })
    });
}, 3000);
const os = require('os');

function getIPAdress() {
    const ret = []
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ret.push(alias.address);
            }
        }
    }
    return ret
}


const qrcode = require('qrcode-terminal');

const ips = getIPAdress()
ips.forEach(e => {
    console.log(`IP:${e}`)
    qrcode.generate(e, { small: false });
})

const keypress = require('keypress');

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'r') {
        ips.forEach(e => {
            console.log(`IP:${e}`)
            qrcode.generate(e, { small: false });
        })
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
        process.exit(0);
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();