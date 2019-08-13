var fs = require('fs');

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
        fs.writeFileSync(`${name}/package.json`, `{
    "name": "${name}",
    "version": "0.1.0",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "tsc -p .&& rollup -c",
        "dev": "tsc -w -p . & rollup -c -w",
        "clean": "rm -rf build && rm -rf demo && rm -rf bundle"
    },
    "license": "Apache-2.0",
    "dependencies": {
        "reflect-metadata": "^0.1.13",
        "rollup": "^1.17.0",
        "rollup-plugin-commonjs": "^10.0.1",
        "rollup-plugin-node-resolve": "^5.2.0",
        "rollup-watch": "^4.3.1",
        "tslib": "^1.10.0",
        "typescript": "^3.5.3"
    }
}`)
    })
}