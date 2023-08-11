import WebSocket from "ws"
import { MSG } from "./server";
import net from "net";


function findAvailablePort(startPort: number, callback: (port: number) => void) {
    const port = startPort || 3000;
    const server = net.createServer();

    server.listen(port, () => {
        server.once('close', () => {
            callback(port);
        });
        server.close();
    });

    server.on('error', () => {
        findAvailablePort(port + 1, callback);
    });
}

export async function findAvailablePortAsync(startPort: number) {
    return new Promise<number>((resolve) => {
        findAvailablePort(startPort, (v) => {
            resolve(v)
        })
    })
}

export async function createControlServer(port: number) {
    let userId = 0
    const wss = new WebSocket.Server({ port })
    wss.on("connection", async (ws, request) => {
        let thisUserId = `User#${userId++}`
        const avaliablePort = await findAvailablePortAsync(3000)
        console.log('Connected', request.headers.host)
        console.log(`${thisUserId} attached to proxy server, port is ${avaliablePort}`.green)
        ws.send(JSON.stringify({
            type: "P2U",
            cmd: "SetUserId",
            payload: {
                "userId": thisUserId,
                "port": avaliablePort
            }
        }))
        const transferServer = await createTransferServer(avaliablePort)
        transferServer.on("connection", async function (ws) {
            console.log(`${thisUserId} transferServer connection`)
            ws.on("message", async function (result: string) {
                console.log(`${thisUserId} received message`)
                transferServer.clients.forEach(e => e.send(result))
            })
        })

        ws.on('close', function (code: number) {
            console.log('close: code = ' + code, thisUserId);
            transferServer.close()
        });
        ws.on('error', function (code: number) {
            console.log('error', code)
            transferServer.close()
        });
    });
    return wss;
}
export async function createTransferServer(port: number) {
    const wss = new WebSocket.Server({ port })
    return wss
}

export async function startProxyServer(port: number) {
    const controlServer = await createControlServer(port)
    console.log("Open Control Server on " + port)
}