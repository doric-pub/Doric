require('shelljs/global')
const fs = require("fs")
const path = require("path")
const SourceMapMerger = require("source-map-merger");

function fromDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter);
        }
        else if (filename.indexOf(filter) >= 0) {
            try {
                doMerge(startPath, files[i])
            } catch (e) {
                console.log(e)
            }
        };
    };
};
function doMerge(startPath, fileName) {
    const filePath = fileName ? path.join(startPath, fileName) : startPath
    if (filePath.indexOf('.es5.') >= 0){
        return
    }
    console.log('File changed:', filePath)
    const mergedMap = SourceMapMerger.createMergedSourceMapFromFiles([
        filePath.replace(/bundle\//, 'build/'),
        filePath,
    ], true);
    fs.writeFileSync(filePath, mergedMap)
    return mergedMap
}

function mergeMappings() {
    fromDir("bundle", ".map")
}

module.exports = {
    build: () => {
        exec('npm run build')
        console.log('Deal mapping')
        mergeMappings()
    },
    clean: () => {
        exec('npm run clean')
    },
    mergeMappings,
    doMerge,
}

