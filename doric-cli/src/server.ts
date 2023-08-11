import WebSocket from "ws"
import "colors";
import path from "path";
import { glob } from "./util";
import { Shell } from "./shell";
import { ChildProcess, } from "child_process";
import fs from "fs";

export type MSG = {
    type: "D2C" | "C2D" | "C2S" | "D2S" | "S2C" | "S2D",
    cmd: string,
    payload: { [index: string]: string }
}

export async function createServer(port: number) {
    let client: WebSocket | undefined = undefined;
    let debug: WebSocket | undefined = undefined;
    let deviceId = 0
    let debugProcess: ChildProcess | undefined = undefined;
    const wss = new WebSocket.Server({ port })
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
                        if (wss.clients.size <= 1) {
                            debug?.send(JSON.stringify({
                                type: "S2D",
                                cmd: "DEBUG_STOP",
                                payload: {
                                    msg: "No devices connected.",
                                }
                            } as MSG));
                            console.log("Debugger need at least one connected device.")
                        } else {
                            wss.clients.forEach(e => {
                                e.send(result);
                            })
                        }
                    } else {
                        client.send(result);
                    }
                } else if (resultObject.type === "C2D") {
                    if (resultObject.cmd === "DEBUG_STOP") {
                        client = undefined;
                        debugProcess?.kill("SIGABRT");
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
                            if (source.endsWith(".ts")) {
                                source = source.replace(".ts", ".js");
                            } else if (!source.endsWith(".js")) {
                                source = source + ".js"
                            }
                            const jsFile = await glob(`**/${source}`, {
                                cwd: path.resolve(process.cwd(), "bundle")
                            })
                            let debuggingFile: string
                            if (!!!jsFile || jsFile.length === 0) {
                                console.error(`Cannot find ${source} in ${path.resolve(process.cwd(), "bundle")}`);
                                let script = resultObject.payload.script as string;
                                const debuggingDir = path.resolve(process.cwd(), "debug");
                                if (!fs.existsSync(debuggingDir)) {
                                    await fs.promises.mkdir(debuggingDir);
                                }
                                debuggingFile = path.resolve(debuggingDir, source);
                                await fs.promises.writeFile(debuggingFile, script, "utf-8");
                            } else {
                                debuggingFile = path.resolve(process.cwd(), "bundle", jsFile[0]);
                            }
                            debugProcess = await Shell.execProcess(
                                "node",
                                [
                                    "--inspect-brk",
                                    debuggingFile,
                                ],
                                {
                                    env: process.env,
                                    consoleHandler: (log) => {
                                        console.log(`Debugger>>>`.gray, log);
                                    }
                                }
                            )
                            console.log(`Debugger on ${debuggingFile}`.green);
                            console.log(`Please open Chrome inspector`, "chrome://inspect/#devices".white.bgGreen);
                            console.log(`And click ${"Open dedicated DevTools for Node".white.bgBlue}`)
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
                    client = undefined;
                }
                if (ws === client) {
                    console.log("quit debugging");
                    client = undefined
                    debug?.send(JSON.stringify({
                        type: "S2D",
                        cmd: "DEBUG_STOP"
                    } as MSG));
                    debugProcess?.kill("SIGABRT");
                }
            });
            ws.on('error', function (code: number) {
                console.log('error', code)
                if (ws === debug) {
                    console.log("quit debugging");
                    client?.send(JSON.stringify({
                        type: "S2C",
                        cmd: "DEBUG_STOP",
                        payload: {
                            msg: "Debugger quit",
                        }
                    } as MSG));
                }
                if (ws === client) {
                    console.log("quit debugging");
                    client = undefined;
                    debug?.send(JSON.stringify({
                        type: "S2D",
                        cmd: "DEBUG_STOP",
                        payload: {
                            msg: "Debugging device quit",
                        }
                    } as MSG));
                }
            });
        });
    return wss;
}


