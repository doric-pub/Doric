import { exec } from "child_process"
import chokidar from "chokidar";
import { createServer } from "./server"
import { delay } from "./util";
import fs from "fs";
import { mergeMap } from "./actions";
import os from "os";
import qrcode from "qrcode-terminal";
import keypress from "keypress";

function getIPAdress() {
  const ret: string[] = [];
  const interfaces = os.networkInterfaces();
  Object.entries(interfaces).map(e => e[1])
    .forEach(e => {
      if (!!!e) {
        return;
      }
      e.forEach(e => {
        if (
          e.family === "IPv4" &&
          e.address !== "127.0.0.1" &&
          !e.internal
        ) {
          ret.push(e.address);
        }
      })
    });
  return ret;
}

export default async function dev() {
  const server = await createServer()
  const tscProcess = exec("node node_modules/.bin/tsc -w -p .");
  const rollupProcess = exec("node node_modules/.bin/rollup -c -w");
  console.warn("Waiting ...");
  const ips = getIPAdress();
  ips.forEach((e) => {
    console.log(`IP:${e}`);
    qrcode.generate(e, { small: true });
  });

  keypress(process.stdin);
  process.stdin.on("keypress", function (ch, key) {
    if (key && key.ctrl && key.name == "r") {
      ips.forEach((e) => {
        console.log(`IP:${e}`);
        qrcode.generate(e, { small: true });
      });
    }
    if (key && key.ctrl && key.name == "c") {
      process.stdin.pause();
      tscProcess.kill("SIGABRT");
      rollupProcess.kill("SIGABRT");
      process.exit(0);
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
  await delay(3000);
  console.warn("Start watching");
  server.listen(7777);
  chokidar
    .watch(process.cwd() + "/bundle", {
      ignored: /.*?\.map/,
      alwaysStat: true,
    })
    .on("change", (jsFile) => {
      console.log("*******", jsFile.replace(process.cwd(), "")
        .replace("/bundle/src/", "")
        .replace(".js", "")
        .green, "*******")
      if ((server as any).debugging) {
        console.log("debugging, hot reload by pass");
        return;
      }
      fs.readFile(jsFile, "utf-8", (error, data) => {
        try {
          const sourceMap = mergeMap(`${jsFile}.map`);
          server.connections.forEach((e: any) => {
            e.sendText(
              JSON.stringify({
                cmd: "RELOAD",
                script: data,
                source: (jsFile.match(/[^/\\]*$/) || [""])[0],
                sourceMap,
              })
            );
          });
        } catch (e) {
          console.error(e);
        }
      });
    });


}


