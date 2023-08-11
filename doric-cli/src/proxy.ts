import WebSocket from "ws"
import { MSG } from "./server"
import qrcode from "qrcode-terminal";

export async function linkProxyServer(server: string, proxy: string) {
    console.log("Running in proxy mode", proxy)
    return new Promise<void>((resolve, reject) => {
        const serverListener = new WebSocket(`ws://${server}`, {
            headers: {
                "role": "PROXY"
            }
        })
        let proxyUserId: string | undefined = undefined
        const controlConnector = new WebSocket(`ws://${proxy}`)
        let transferConnector: WebSocket | undefined = undefined;
        serverListener.on('open', () => {
            console.log('Proxy attached to server', server)
            resolve()
        })
        serverListener.on('message', (data) => {
            transferConnector?.send(data)
        })
        serverListener.on('error', (error) => {
            console.log(error)
            transferConnector?.close()
            controlConnector?.close()
            reject(error)
        })

        controlConnector.on('open', () => {
            console.log('Connected to proxy', proxy)
        })
        controlConnector.on('message', (data) => {
            const msg = JSON.parse(data as string) as MSG
            const payload = msg.payload
            if (msg.cmd === "SetUserId") {
                proxyUserId = payload.userId
                const nextPort = payload.port
                const transferAddr = proxy.replace(/:[0-9]*/, "") + ":" + nextPort
                console.log("Get proxy UserId", proxyUserId, "addr", transferAddr)
                transferConnector = new WebSocket("ws://" + transferAddr)
                setTimeout(() => {
                    console.log("PROXY ADDRESS: " + transferAddr.green)
                    qrcode.generate(transferAddr, { small: true });
                    process.stdin.on("keypress", function (ch, key) {
                        if (key && key.ctrl && key.name == "p") {
                            console.log("PROXY ADDRESS: " + transferAddr.green)
                            qrcode.generate(transferAddr, { small: true });
                        }
                    });
                }, 3000)
            }
        })
        controlConnector.on('error', (error) => {
            console.log(error)
            transferConnector?.close()
            controlConnector?.close()
            reject(error)
        })
    })

}