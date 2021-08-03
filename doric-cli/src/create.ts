import fs from "fs"
import path from "path"
import { getAssetsDir, getLibAssetsDir } from "./util"
import { Shell } from "./shell";

const targetJSPath = getAssetsDir();
const targetAndroidPath = path.resolve(targetJSPath, "android")
const targetiOSPath = path.resolve(targetJSPath, "iOS")
const currentVersion = fs.readFileSync(path.resolve(targetJSPath, "version")).toString().trim()

async function shellCopy(dist: string, src: string) {
    await Shell.exec("cp", [
        "-rf",
        src,
        dist
    ])
}

async function initJS(dir: string, name: string) {
    await fs.promises.writeFile(
        path.resolve(dir, "package.json"),
        (await fs.promises.readFile(path.resolve(targetJSPath, "_package.json"), "utf-8"))
            .replace(/__\$__/g, name).replace(/__\$Version__/g, currentVersion));
    await shellCopy(path.resolve(dir, "tsconfig.json"), path.resolve(targetJSPath, "_tsconfig.json"));
    await shellCopy(path.resolve(dir, "rollup.config.js"), path.resolve(targetJSPath, "_rollup.config.js"));
    await shellCopy(path.resolve(dir, ".gitignore"), path.resolve(targetJSPath, "_gitignore"));
    await fs.promises.mkdir(path.resolve(dir, ".vscode"));
    await shellCopy(path.resolve(dir, ".vscode", "launch.json"), path.resolve(targetJSPath, "_launch.json"))
    await shellCopy(path.resolve(dir, ".vscode", "tasks.json"), path.resolve(targetJSPath, "_tasks.json"))
    await fs.promises.mkdir(path.resolve(dir, "src"))
    await fs.promises.writeFile(
        path.resolve(dir, "src", `${name}.ts`),
        (await fs.promises.readFile(path.resolve(targetJSPath, "$.ts"), "utf-8")).replace(/__\$__/g, name));
    await fs.promises.writeFile(
        path.resolve(dir, `index.ts`),
        `export default ['src/${name}']`);
    console.log(`Create Doric JS Project Success`.green)
}

async function initAndroid(dir: string, name: string) {
    const androidDir = `${dir}/android`
    await shellCopy(dir, targetAndroidPath);
    for (let file of [
        'app/src/main/java/pub/doric/android/MainActivity.java',
        'app/src/main/AndroidManifest.xml',
        'app/build.gradle',
        'app/src/main/res/values/strings.xml',
        'settings.gradle',
    ]) {
        const sourceFile = path.resolve(androidDir, file);
        await fs.promises.writeFile(
            sourceFile,
            (await fs.promises.readFile(sourceFile, "utf-8"))
                .replace(/__\$__/g, name)
                .replace(/__\$appKey__/g, name.replace(/-/g, "_").toLowerCase())
                .replace(/__\$Version__/g, currentVersion));
    }
    console.log(`Create Doric Android Project Success`.green);
}
async function initiOS(dir: string, name: string) {
    const iOSDir = `${dir}/iOS`
    await shellCopy(dir, targetiOSPath);
    for (let file of [
        'App/SceneDelegate.m',
        'App/AppDelegate.m',
        'Example.xcodeproj/project.pbxproj',
        'Podfile',
    ]) {
        const sourceFile = path.resolve(iOSDir, file);
        await fs.promises.writeFile(
            sourceFile,
            (await fs.promises.readFile(sourceFile, "utf-8"))
                .replace(/__\$__/g, name)
                .replace(/__\$appKey__/g, name.replace(/-/g, "_").toLowerCase())
                .replace(/__\$Version__/g, currentVersion));
    }
    await fs.promises.rename(path.resolve(iOSDir, "Example.xcodeproj"), path.resolve(iOSDir, `${name}.xcodeproj`));
    console.log(`Create Doric iOS Project Success`.green);
}

export async function create(name: string) {
    const cwd = path.resolve(process.cwd(), name)
    if (fs.existsSync(name)) {
        console.warn(`Dir:${cwd}/${name} already exists`)
        return;
    }
    await fs.promises.mkdir(name)
    console.log(`Create doric project at ${cwd}`);
    await initJS(cwd, name)
    const androidDir = `${cwd}/android`
    if (fs.existsSync(androidDir)) {
        console.warn(`Dir:${androidDir} already exists`)
    } else {
        await initAndroid(cwd, name)
    }
    const iOSDir = `${cwd}/iOS`
    if (fs.existsSync(iOSDir)) {
        console.warn(`Dir:${iOSDir} already exists`)
    } else {
        await initiOS(cwd, name)
    }
    console.log("Install node modules ...".green)
    await Shell.exec('npm', ['install'], {
        cwd,
        env: process.env,
        consoleHandler: (info) => {
            console.log(info)
        }
    });
    console.log("Installed, welcome!".green)
}

async function modifyContent(cwd: string, name: string) {
    const dealingFiles = [
        "package.json",
        "rollup.config.js",
        "android/src/main/java/pub/doric/library/DoricTemplateLibrary.java",
        "iOS/Classes/DoricTemplateLibrary.h",
        "iOS/Classes/DoricTemplateLibrary.m",
        "Template.podspec",
        "example/android/app/src/main/java/pub/doric/android/MainApplication.java",
        "example/iOS/App/SceneDelegate.m",
        "example/src/Example.ts",
        "example/package.json",
    ]
    for (let dealingFile of dealingFiles) {
        const filePath = await path.resolve(cwd, dealingFile)
        let content = await fs.promises.readFile(filePath, "utf-8")
        content = content
            .replace(/__\$__/g, name.toLocaleLowerCase())
            .replace(/__\$RawName__/g, name)
            .replace(/__\$Version__/g, currentVersion)
        await fs.promises.writeFile(filePath, content, "utf-8")
    }
}

async function renameFiles(cwd: string, name: string) {
    const renameFiles: [string, string][] = [
        ["android/src/main/java/pub/doric/library", "DoricTemplateLibrary.java"],
        [".", "Template.podspec"],
        ["iOS/Classes", "DoricTemplateLibrary.h"],
        ["iOS/Classes", "DoricTemplateLibrary.m"],
    ]
    for (let renameFile of renameFiles) {
        await fs.promises.rename(
            path.resolve(cwd, renameFile[0], renameFile[1]),
            path.resolve(cwd, renameFile[0], renameFile[1].replace("Template", name)))
    }
}

export async function createLib(name: string) {
    const cwd = path.resolve(process.cwd(), name)
    if (fs.existsSync(name)) {
        console.warn(`Dir:${cwd}/${name} already exists`)
        return;
    }
    await fs.promises.mkdir(name)
    const libAssets = getLibAssetsDir()
    console.log(`Create doric library project at ${cwd}`)
    const files = await fs.promises.readdir(libAssets)
    for (let file of files) {
        await shellCopy(cwd, path.resolve(libAssets, file))
    }
    await modifyContent(cwd, name)
    await renameFiles(cwd, name)
    console.log("Install node modules ...".green)
    await Shell.exec('npm', ['install'], {
        cwd,
        env: process.env,
        consoleHandler: (info) => {
            console.log(info)
        }
    });
    console.log("Install example project ...".green)
    await Shell.exec('npm', ['install'], {
        cwd: path.resolve(cwd, "example"),
        env: process.env,
        consoleHandler: (info) => {
            console.log(info)
        }
    });
    console.log("Installed, welcome!".green)
}
