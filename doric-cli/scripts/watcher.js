var chokidar = require('chokidar')
require('shelljs/global')

exec('npm run dev', () => {
})
chokidar.watch(process.cwd() + "/build", {
    ignored: /(^|[\/\\])\../,
}).on('all', (event, path) => {
    console.log(event, path)
});
