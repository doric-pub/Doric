var fs = require('fs');
require('shelljs/global')

module.exports = function (name) {
    if (fs.existsSync(name)) {
        console.warn(`Dir:${process.cwd()}/${name} already exists`)
        return;
    }
    fs.mkdir(name, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(`create dir ${name} success`);
        fs.writeFileSync(`${name}/package.json`, fs.readFileSync(`${__dirname}/../contents/_package.json`).toString().replace(/__\$__/g, name))
        fs.writeFileSync(`${name}/tsconfig.json`, fs.readFileSync(`${__dirname}/../contents/_tsconfig.json`))
        fs.writeFileSync(`${name}/rollup.config.js`, fs.readFileSync(`${__dirname}/../contents/_rollup.config.js`))
        fs.writeFileSync(`${name}/.gitignore`, fs.readFileSync(`${__dirname}/../contents/_gitignore`))
        fs.mkdirSync(`${name}/.vscode`)
        fs.writeFileSync(`${name}/.vscode/launch.json`, fs.readFileSync(`${__dirname}/../contents/_launch.json`).toString().replace(/__\$__/g, name))
        fs.writeFileSync(`${name}/.vscode/tasks.json`, fs.readFileSync(`${__dirname}/../contents/_tasks.json`).toString().replace(/__\$__/g, name))
        fs.mkdirSync(`${name}/src`)
        fs.writeFileSync(`${name}/src/${name}.ts`, fs.readFileSync(`${__dirname}/../contents/$.ts`).toString().replace(/__\$__/g, name))
        fs.writeFileSync(`${name}/index.ts`, `export default ['src/${name}']`)
        exec(`cd ${name} && npm install && npm run build`, () => {
            console.log(`Create Doric Project ${name} Success`)
        })
    })
}