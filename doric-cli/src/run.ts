import { Shell } from "./shell";
import fs from "fs";
import { glob } from "./util";
import path from "path";
import xml2js, { Element } from "xml-js";

export async function run(platform: string) {
    switch (platform.toLowerCase()) {
        case "android":
            await runAndroid();
            break;
        case "ios":
            await runiOS();
            break;
        default:
            throw new Error("Donnot support " + platform);
    }
}

async function runAndroid() {
    console.log("Running on Android");
    const androidDir = path.resolve(process.cwd(), "android");
    if (!fs.existsSync(androidDir)) {
        console.log("Cannot find Android Project".red)
        return;
    }
    const androidSDKHome = process.env["ANDROID_HOME"] || process.env["ANDROID_SDK_ROOT"]
    if (!androidSDKHome) {
        console.log("Please set env variable $ANDROID_HOME or $ANDROID_SDK_ROOT".red)
        return;
    }
    const adbPath = path.resolve(androidSDKHome, "platform-tools", "adb");
    console.log("Waiting for building".green);
    console.log("====================");
    await Shell.exec("sh", ["gradlew", "assembleDebug"], {
        cwd: androidDir,
        env: process.env,
        consoleHandler: (info) => console.log(info)
    });
    const apkFiles = await glob("**/outputs/apk/debug/*.apk", {
        cwd: androidDir,
    })
    if (apkFiles == null || apkFiles.length == 0) {
        console.log("Cannot find APK".red)
        return;
    }
    const apkFile = path.resolve(androidDir, apkFiles[0])
    console.log("Built Android APK".green, apkFile.blue);
    console.log("====================");
    console.log("Installing apk".green)
    await Shell.exec(adbPath, ["install", "-t", "-r", apkFile], {
        consoleHandler: (info) => console.log(info)
    });

    const apk_analyzer = path.resolve(androidSDKHome, "tools", "bin", "apkanalyzer");
    const ret = await Shell.execOut(apk_analyzer, ["manifest", "print", apkFile])
    const xlmobj = xml2js.xml2js(ret) as Element;
    const element = xlmobj.elements
        ?.find(e => e.name === "manifest")?.elements
        ?.find(e => e.name === "application")?.elements
        ?.filter(e => e.name === "activity")
        ?.filter(e => e.elements
            ?.find(e => e.name === "intent-filter" && e.elements
                ?.find(e => e.name === "action")?.attributes?.["android:name"] === "android.intent.action.MAIN"))
    if (element && element.length > 0) {
        const activityElement = element[0];
        const mainActivity = activityElement.attributes?.["android:name"]
        const packageName = xlmobj.elements
            ?.find(e => e.name === "manifest")?.attributes?.["package"];
        await Shell.exec(
            adbPath,
            ["shell",
                "am", "start",
                "-n", `${packageName}/${mainActivity}`,
                "-a", "android.intent.action.MAIN",
                "-c", "android.intent.category.LAUNCHER"],
            {
                consoleHandler: (info) => console.log(info)
            });
    } else {
        console.log("Cannot find activity for launch")
    }
}

async function runiOS() {

}