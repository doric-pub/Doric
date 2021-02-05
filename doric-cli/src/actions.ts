import { Shell } from "./shell";
import { createMergedSourceMapFromFiles } from "source-map-merger"
import fs from "fs"
import { glob } from "./util";

export async function build() {
    await Shell.exec("node", ["node_modules/.bin/tsc", "-p", "."]);
    await Shell.exec("node", ["node_modules/.bin/rollup", "-c"]);
    const bundleFiles = await glob("bundle/**/*.js");
    for (let bundleFile of bundleFiles) {
        await doMerge(bundleFile);
    }
}

export async function clean() {
    await Shell.exec("rm", ["-rf", "build"]);
    await Shell.exec("rm", ["-rf", "bundle"]);
}

export async function doMerge(jsFile: string) {
    const mappingFile = `${jsFile}.map`;
    console.log(`Bundle -> ${jsFile.green}`);
    if (!fs.existsSync(mappingFile)) {
        return;
    }
    console.log(`       -> ${mappingFile.green}`);
    const mergedMap = createMergedSourceMapFromFiles([
        mappingFile.replace(/bundle\//, 'build/'),
        mappingFile,
    ], true);
    await fs.promises.writeFile(mappingFile, mergedMap);
}
