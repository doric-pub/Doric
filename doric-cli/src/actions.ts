import { Shell } from "./shell";
import { createMergedSourceMapFromFiles } from "source-map-merger"
import fs from "fs";
import { glob } from "./util";
import path from "path";
export async function build() {
    let ret = await Shell.exec("node_modules/.bin/tsc", ["-p", "."], {
        env: process.env,
        consoleHandler: (info) => {
            console.log(info);
        }
    });
    if (ret !== 0) {
        console.log("Compile error".red);
        return -1;
    }
    ret = await Shell.exec("node_modules/.bin/rollup", ["-c",], {
        env: process.env,
        consoleHandler: (info) => {
            console.log(info);
        }
    });
    if (ret !== 0) {
        console.log("Compile error".red);
        return -1;
    }
    const bundleFiles = await glob("bundle/**/*.js");
    for (let bundleFile of bundleFiles) {
        await doMerge(bundleFile);
    }
    if (fs.existsSync("assets")) {
        const assets = await fs.promises.readdir("assets")
        await Shell.exec("cp", ["-rf", "assets", "bundle/"]);
        for (let asset of assets) {
            const assetFile = path.resolve("assets", asset);
            const stat = await fs.promises.stat(assetFile);
            if (stat.isDirectory()) {
                console.log(`Asset -> ${asset.yellow}`);
            } else {
                console.log(`Asset -> ${asset.green}`);
            }
        }
    }
    return 0
}

export async function clean() {
    await Shell.exec("rm", ["-rf", "build"]);
    await Shell.exec("rm", ["-rf", "bundle"]);
}

async function doMerge(jsFile: string) {
    const mapFile = `${jsFile}.map`;
    console.log(`Bundle -> ${jsFile.green}`);
    if (!fs.existsSync(mapFile)) {
        return;
    }
    console.log(`       -> ${mapFile.green}`);
    await mergeMap(mapFile);
}


export async function mergeMap(mapFile: string) {
    const mapContent = await fs.promises.readFile(mapFile, "utf-8");
    try {
        if (JSON.parse(mapContent).merged) {
            console.log("Already merged");
            return;
        }
    } catch (err) {
        console.error(err);
    }
    const lockFile = `${mapFile}.lock`;
    if (fs.existsSync(lockFile)) {
        console.log("In mergeMap,skip")
        return;
    }
    await fs.promises.writeFile(lockFile, (new Date).toString(), "utf-8")
    try {
        const buildMap = mapFile.replace(/bundle\//, 'build/')
        if (fs.existsSync(buildMap)) {
            const mergedMap = createMergedSourceMapFromFiles([
                buildMap,
                mapFile,
            ], true) as string;
            const mapObj = JSON.parse(mergedMap);
            mapObj.merged = true
            await fs.promises.writeFile(mapFile, JSON.stringify(mapObj), "utf-8");
        }
    } finally {
        await fs.promises.unlink(lockFile)
    }

}