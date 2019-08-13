const chokidar = require('chokidar')
const ws = require('./server')
const fs = require("fs")

require('shelljs/global')

exec('npm run dev >/dev/null 2>&1', { async: true })
console.warn('Waiting ...')
setTimeout(() => {
    console.warn('Start watching')
    ws.listen(7777)
    chokidar.watch(process.cwd() + "/bundle", {
        ignored: /(^|[\/\\])\../,
    }).on('change', (path) => {
        console.log('path is ', path)
        fs.readFile(path, 'utf-8', (error, data) => {
            console.log('send data ', data)
            ws.connections.forEach(e => {
                e.sendText(JSON.stringify({
                    script: data,
                    source: path.match(/[^/\\]*$/)[0],
                }))
            })
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
console.log(`本机IP是${ips}`)
ips.forEach(e => {
    console.log(`IP:${e}`)
    qrcode.generate(e, { small: true });
})
