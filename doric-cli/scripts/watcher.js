const chokidar = require('chokidar')
const ws = require('./server')
const fs = require("fs")

require('shelljs/global')

exec('npm run dev', () => {
})
ws.listen(7777)
chokidar.watch(process.cwd() + "/bundle", {
    ignored: /(^|[\/\\])\../,
}).on('all', (event, path) => {
    console.log('path is ', path)
    if (event === 'add' || event === 'change') {
        fs.readFile(path, 'utf-8', (error, data) => {
            console.log('send data ', data)
            ws.connections.forEach(e => {
                e.sendText(data)
            })
        })
    }
});
