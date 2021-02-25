import { exec } from "child_process"
import chokidar from "chokidar";
import { createServer, MSG } from "./server"
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
  const tscProcess = exec("node node_modules/.bin/tsc -w -p .", {
    env: process.env,
  });
  const rollupProcess = exec("node node_modules/.bin/rollup -c -w", {
    env: process.env,
  });
  [tscProcess, rollupProcess].forEach(e => {
    e.stdout?.on("data", (data) => {
      console.log(data.toString());
    });
    e.stderr?.on("data", (data) => {
      console.log(data.toString());
    });
  })

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
  const cachedContents: Record<string, string> = {}
  chokidar
    .watch(process.cwd() + "/bundle", {
      ignored: /.*?\.map/,
      alwaysStat: true,
    })
    .on("change", (jsFile) => {
      const content = fs.readFileSync(jsFile, "utf-8");
      if (cachedContents[jsFile]) {
        if (content.indexOf(cachedContents[jsFile]) >= 0) {
          return;
        }
      }
      cachedContents[jsFile] = content;
      console.log("*******", jsFile.replace(process.cwd(), "")
        .replace("/bundle/src/", "")
        .replace(".js", "")
        .green, "*******");
      try {
        const sourceMap = `${jsFile}.map`
        if (fs.existsSync(sourceMap)) {
          mergeMap(sourceMap);
        }
        server.clients.forEach((e) => {
          e.send(
            JSON.stringify({
              type: "S2C",
              cmd: "RELOAD",
              payload: {
                script: content,
                source: (jsFile.match(/[^/\\]*$/) || [""])[0],
                sourceMap,
              }
            } as MSG)
          );
        });
      } catch (e) {
        console.error(e);
      }
    });


}


