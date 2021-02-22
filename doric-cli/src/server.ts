import WebSocket from "ws"
import "colors";
import path from "path";
import { glob } from "./util";
import { Shell } from "./shell";

export type MSG = {
    type: "D2C" | "C2D" | "C2S" | "D2S" | "S2C" | "S2D",
    cmd: string,
    payload: { [index: string]: string }
}

export async function createServer() {
    let client: WebSocket | undefined = undefined;
    let debug: WebSocket | undefined = undefined;
    let deviceId = 0
    const wss = new WebSocket.Server({ port: 7777 })
        .on("connection", (ws, request) => {
            let thisDeviceId: string
            console.log('Connected', request.headers.host)
            if (request.headers.host?.startsWith("localhost")) {
                thisDeviceId = `Debugger#${deviceId++}`
                console.log(`${thisDeviceId} attached to dev kit`.green)
                debug = ws;
            } else {
                thisDeviceId = `Client#${deviceId++}`
                console.log(`${thisDeviceId} attached to dev kit`.green)
            }
            ws.on('message', async function (result: string) {
                const resultObject = JSON.parse(result) as MSG
                if (resultObject.type === "D2C") {
                    if (client === undefined) {
                        wss?.clients.forEach(e => {
                            e.send(result);
                        })
                    } else {
                        client.send(result);
                    }
                } else if (resultObject.type === "C2D") {
                    if (resultObject.cmd === "DEBUG_STOP") {
                        client = undefined;
                    }
                    if (client === undefined) {
                        client = ws;
                    } else if (client !== ws) {
                        console.log("Can only debugging one client at the same time.".red);
                    }
                    debug?.send(result);
                } else if (resultObject.type === "C2S") {
                    switch (resultObject.cmd) {
                        case 'DEBUG':
                            let source = resultObject.payload.source as string;
                            if (source.endsWith(".js")) {
                                source = source.replace(".js", ".ts");
                            } else if (!source.endsWith(".ts")) {
                                source = source + ".ts"
                            }
                            const tsFiles = await glob(`**/${source}`, {
                                cwd: path.resolve(process.cwd(), "src")
                            })
                            if (!!!tsFiles || tsFiles.length === 0) {
                                console.error(`Cannot find ${source} in ${path.resolve(process.cwd(), "src")}`);
                            }
                            const sourceFile = tsFiles[0];
                            Shell.exec("node", [
                                "--inspect-brk",
                                path.resolve(process.cwd(), "src", sourceFile)
                            ])
                            console.log(`Debugger on ${sourceFile}`);
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
            });
            ws.on('close', function (code: number) {
                console.log('close: code = ' + code, thisDeviceId);
                if (ws === debug) {
                    console.log("quit debugging");
                    client?.send(JSON.stringify({
                        type: "S2C",
                        cmd: "DEBUG_STOP"
                    } as MSG));
                }
                if (ws === client) {
                    console.log("quit debugging");
                    client = undefined
                }
            });
            ws.on('error', function (code: number) {
                console.log('error', code)
                if (ws === debug) {
                    console.log("quit debugging");
                    client?.send(JSON.stringify({
                        type: "S2C",
                        cmd: "DEBUG_STOP"
                    } as MSG));
                }
                if (ws === client) {
                    console.log("quit debugging");
                    client = undefined
                }
            });
        });
    return wss;
}


