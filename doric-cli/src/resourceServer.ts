import fs from "fs"
import path from "path"
import http from 'http';
import { IncomingMessage, ServerResponse } from "http";
export async function createResServer() {
    const port = 7778;
    const server = http.createServer();
    server.listen(port);
    console.log(`Resource server is listening on port ${port} !`.green);
    server.on('request', (request: IncomingMessage, response: ServerResponse) => {
        const { url } = request;
        if (url) {
            try {
                const pathArr = url.split("/");
                const resName = pathArr[pathArr.length - 1];
                const dirPath = path.join(process.cwd(), url.replace(`/${resName}`, ""));
                const fileRealName = findResRealName(dirPath, resName);
                const resourcePath = path.join(dirPath, `${fileRealName}`);
                if (fs.existsSync(resourcePath)) {
                    const data = fs.readFileSync(resourcePath);
                    response.setHeader("content-length", data.length);
                    response.write(data);
                    response.end();
                } else {
                    response.setHeader("content-type", "text/html; charset=utf-8");
                    console.error(`Resources ${resName} do not exist !`.red)
                    response.end(`Resources ${resName} do not exist !`);
                }
            } catch (error) {
                response.setHeader("content-type", "text/html; charset=utf-8");
                console.error(`Server internal error`.red)
                response.end("Server internal error" + error);
            }
        } else {
            response.setHeader("content-type", "text/html; charset=utf-8");
            console.error(`url is undefined`.red)
            response.end("url is undefined");
        }
    });

    function findResRealName(dirPath: string, fileName: string) {
        let fileFinalName = "";
        const stats = fs.readdirSync(dirPath);
        for (let stat of stats) {
            if (stat.startsWith(`${fileName}.`) || stat === fileName) {
                fileFinalName = stat;
                return fileFinalName;
            }
        }
    }
}
