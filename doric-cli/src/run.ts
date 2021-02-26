import { Shell } from "./shell";
import fs from "fs";
import { glob } from "./util";
import path from "path";
import xml2js, { Element } from "xml-js";
import inquirer from "inquirer";

export async function run(platform: string) {
  switch (platform.toLowerCase()) {
    case "android":
      await runAndroid();
      break;
    case "ios":
      await runiOS();
      break;
    default:
      throw new Error("Do not support " + platform);
  }
}

async function runAndroid() {
  console.log("Running on Android");
  const androidDir = path.resolve(process.cwd(), "android");
  if (!fs.existsSync(androidDir)) {
    console.log("Cannot find Android Project".red);
    return;
  }
  const androidSDKHome =
    process.env["ANDROID_HOME"] || process.env["ANDROID_SDK_ROOT"];
  if (!androidSDKHome) {
    console.log(
      "Please set env variable $ANDROID_HOME or $ANDROID_SDK_ROOT".red
    );
    return;
  }
  const adbPath = path.resolve(androidSDKHome, "platform-tools", "adb");
  console.log("Waiting for building".green);
  console.log("====================");
  await Shell.exec("sh", ["gradlew", "assembleDebug"], {
    cwd: androidDir,
    env: process.env,
    consoleHandler: (info) => console.log(info),
  });
  const apkFiles = await glob("**/outputs/apk/debug/*.apk", {
    cwd: androidDir,
  });
  if (apkFiles == null || apkFiles.length == 0) {
    console.log("Cannot find APK".red);
    return;
  }
  const apkFile = path.resolve(androidDir, apkFiles[0]);
  console.log("Built Android APK".green, apkFile.blue);
  console.log("====================");
  console.log("Installing apk".green);
  await Shell.exec(adbPath, ["install", "-t", "-r", apkFile], {
    consoleHandler: (info) => console.log(info),
  });

  const apk_analyzer = path.resolve(
    androidSDKHome,
    "tools",
    "bin",
    "apkanalyzer"
  );
  const ret = await Shell.execOut(apk_analyzer, ["manifest", "print", apkFile]);
  const xlmobj = xml2js.xml2js(ret) as Element;
  const element = xlmobj.elements
    ?.find((e) => e.name === "manifest")
    ?.elements?.find((e) => e.name === "application")
    ?.elements?.filter((e) => e.name === "activity")
    ?.filter((e) =>
      e.elements?.find(
        (e) =>
          e.name === "intent-filter" &&
          e.elements?.find((e) => e.name === "action")?.attributes?.[
          "android:name"
          ] === "android.intent.action.MAIN"
      )
    );
  if (element && element.length > 0) {
    const activityElement = element[0];
    const mainActivity = activityElement.attributes?.["android:name"];
    const packageName = xlmobj.elements?.find((e) => e.name === "manifest")
      ?.attributes?.["package"];
    await Shell.exec(
      adbPath,
      [
        "shell",
        "am",
        "start",
        "-n",
        `${packageName}/${mainActivity}`,
        "-a",
        "android.intent.action.MAIN",
        "-c",
        "android.intent.category.LAUNCHER",
      ],
      {
        consoleHandler: (info) => console.log(info),
      }
    );
  } else {
    console.log("Cannot find activity for launch");
  }
}

async function runiOS() {
  console.log("Running on iOS");
  const iOSDir = path.resolve(process.cwd(), "iOS");
  if (!fs.existsSync(iOSDir)) {
    console.log("Cannot find iOS Project".red);
    return;
  }
  const devices: {
    name: string,
    deviceId: string,
    isSimulator: boolean
  }[] = [];
  const simulators: {
    name: string,
    deviceId: string,
    isSimulator: boolean
  }[] = [];
  const deviceOut = await Shell.execOut("xcrun", ["xctrace", "list", "devices"]);
  let deviceIndex = 0;
  let simulatorIndex = Number.MAX_SAFE_INTEGER;
  deviceOut.split("\n").filter(e => e?.length > 0).forEach((e, index) => {
    if (e.trim() === "== Devices ==") {
      deviceIndex = index;
    } else if (e.trim() === "== Simulators ==") {
      simulatorIndex = index;
    } else {
      const regRet = /(.*)\((.*?)\)/.exec(e);
      if (regRet) {
        if (index > deviceIndex && index < simulatorIndex) {
          devices.push({
            name: regRet[1],
            deviceId: regRet[2],
            isSimulator: false,
          });
        } else {
          simulators.push({
            name: regRet[1],
            deviceId: regRet[2],
            isSimulator: true,
          })
        }
      }
    }
  });

  const answer = await inquirer.prompt([{
    type: 'list',
    message: 'Please choose which device you want to install',
    name: 'device',
    default: [...devices, ...simulators].find(e => e.name.indexOf("iPhone") >= 0)?.name,
    choices: [...devices, ...simulators].map(e => e.name),
  }]);
  const selectedDevice = devices.find(e => e.name === answer["device"])
    || simulators.find(e => e.name === answer["device"])
  if (!selectedDevice) {
    console.log("Cannot find iOS device".red);
    return;
  }
  console.log("Waiting for building".green);
  console.log("====================");
  await Shell.exec("pod", ["install"], {
    env: process.env,
    consoleHandler: (info) => console.log(info),
    cwd: iOSDir,
  });
  const workspaceFiles = await glob("*.xcworkspace", { cwd: iOSDir });
  if (workspaceFiles?.length !== 1) {
    console.log("Cannot find project".red);
    return;
  }
  const workspace = workspaceFiles[0];
  const scheme = workspace.replace(".xcworkspace", "");
  const ret = await Shell.exec(
    "xcodebuild",
    [
      "-workspace", workspace,
      "-scheme", scheme,
      ...selectedDevice.isSimulator ? ["-sdk", "iphonesimulator",] : [],
      "-derivedDataPath", "build"
    ],
    {
      cwd: iOSDir,
      env: process.env,
      consoleHandler: (info) => {
        console.log(info);
      }
    });
  if (ret !== 0) {
    console.log("Compile error".red);
    return;
  }
  const iOSAPPs = await glob(
    `**/*${selectedDevice.isSimulator ? "iphonesimulator" : "iphoneos"}/*.app`,
    { cwd: path.resolve(iOSDir, "build") });
  if (iOSAPPs?.length !== 1) {
    console.log("Cannot find built app".red);
    return;
  }
  const iOSAPP = path.resolve(iOSDir, "build", iOSAPPs[0]);

  console.log("Built iOS APP".green, iOSAPP.blue);
  console.log("====================");
  console.log("Installing APP to".green, selectedDevice.name.blue);
  if (selectedDevice.isSimulator) {
    const pxjFile = path.resolve(iOSDir, (await glob("**/project.pbxproj", { cwd: iOSDir }))[0]);
    const pxjContent = await fs.promises.readFile(pxjFile, "utf-8");
    const bundleId = /PRODUCT_BUNDLE_IDENTIFIER\s=\s(\S*?);/g.exec(pxjContent)?.[1];
    await Shell.exec("xcrun", ["instruments", "-w", selectedDevice.deviceId])
    await Shell.exec("xcrun", ["simctl", "install", selectedDevice.deviceId, iOSAPP]);
    await Shell.exec("xcrun", ["simctl", "launch", selectedDevice.deviceId, bundleId || `pub.doric.ios.${scheme.toLowerCase()}`]);
  } else {
    const iosDeploy = path.resolve("node_modules", ".bin", "ios-deploy")
    await Shell.exec(
      iosDeploy,
      [
        "--id", selectedDevice.deviceId,
        "--justlaunch",
        "--debug",
        "--bundle", iOSAPP
      ])
  }
}
