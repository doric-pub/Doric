import fs from "fs";
import WebSocket from "ws"
import "colors";
import path from "path";
import { delay, glob } from "./util";
import { Shell } from "./shell";


export type MSG = {
    type: "D2C" | "C2D" | "C2S" | "D2S" | "S2C" | "S2D",
    cmd: string,
    payload: { [index: string]: string }
}

export async function createServer() {
    let contextId: string = "0"
    let clientConnection: WebSocket | undefined = undefined
    let debuggerConnection: WebSocket | undefined = undefined
    let deviceId = 0
    return new WebSocket.Server({ port: 7777 })
        .on("connection", (ws, request) => {
            let thisDeviceId: string
            console.log('Connected', request.headers.host)
            if (request.headers.host?.startsWith("localhost")) {
                thisDeviceId = `Debugger#${deviceId++}`
                console.log(`Debugger ${thisDeviceId} attached to dev kit`.green)
                debuggerConnection = ws
                clientConnection?.send(JSON.stringify({
                    cmd: 'SWITCH_TO_DEBUG',
                    contextId: contextId
                }))
            } else {
                thisDeviceId = `Client#${deviceId++}`
                console.log(`${thisDeviceId} attached to dev kit`.green)
            }
            ws.on('message', async function (result: string) {
                const resultObject = JSON.parse(result) as MSG
                if (resultObject.type === "D2C" || resultObject.type === "C2D") {
                    ws.send(result);
                } else if (resultObject.type === "C2S") {
                    switch (resultObject.cmd) {
                        case 'DEBUG':
                            clientConnection = ws;
                            (ws as any).debugging = true;
                            console.log("Enter debugging");
                            contextId = resultObject.payload.contextId;
                            const projectHome = '.';
                            await fs.promises.writeFile(path.resolve(projectHome, "build", "context"), contextId, "utf-8");
                            let source = resultObject.payload.source as string;
                            if (source.startsWith(".js")) {
                                source = source.replace(".js", ".ts");
                            } else if (!source.startsWith(".ts")) {
                                source = source + ".ts"
                            }
                            let sourceFile = path.resolve(projectHome, "src", source);
                            if (!fs.existsSync(sourceFile)) {
                                const tsFiles = await glob(source, {
                                    cwd: path.resolve(projectHome, "src")
                                })
                                if (!!!tsFiles || tsFiles.length === 0) {
                                    console.error(`Cannot find ${source} in ${path.resolve(projectHome)}`);
                                }
                                sourceFile = tsFiles[0];
                            }
                            console.log(thisDeviceId + " request debug, project home: " + projectHome);
                            await Shell.exec("code", [projectHome, sourceFile]);
                            await delay(1500);
                            break;
                        case 'EXCEPTION':
                            console.log(resultObject.payload.source.red);
                            console.log(resultObject.payload.exception.red);
                            break;
                        case 'LOG':
                            const date = new Date
                            const format = function (num: number) {
                                return (Array(2).join("0") + num).slice(-2);
                            };
                            const timeStr = `${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}.${(Array(3).join("0") + date.getMilliseconds()).slice(-3)}`
                            const logContent = resultObject.payload.message
                            if (resultObject.payload.type === 'DEFAULT') {
                                console.log(`${timeStr} ${thisDeviceId} ${"[I]".green} ${logContent.green}`.bgBlue);
                            } else if (resultObject.payload.type === 'ERROR') {
                                console.log(`${timeStr} ${thisDeviceId} ${"[E]".green} ${logContent.green}`.bgRed);
                            } else if (resultObject.payload.type === 'WARN') {
                                console.log(`${timeStr.black} ${thisDeviceId.black} ${"[W]".green} ${logContent.green}`.bgYellow);
                            }
                            break
                    }
                }
            })
            ws.on('connect', function (code: number) {
                console.log('connect', code)
            })
            ws.on('close', function (code: number) {
                console.log('close: code = ' + code, thisDeviceId)
                console.log("quit debugging");
                (ws as any).debugging = false
            })
            ws.on('error', function (code: number) {
                console.log('error', code)
            })
        })
}


