import fs from "fs"
import path from "path"
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
export async function createResServer() {
    const port = 7778;
    const server = http.createServer();
    server.listen(port);
    console.log(`resource server is listening on port ${port} !`.green);
    server.on("request", (request: IncomingMessage, response: ServerResponse) => {
        const { url } = request;
        if (url) {
            try {
                const pathArr = url.split("/");
                const resName = pathArr[pathArr.length - 1];
                const dirPath = path.join(process.cwd(), url.replace(`/${resName}`, ""));
                const resourcePath = findFilePath(dirPath, resName);
                if (resourcePath.length != 0) {
                    const data = fs.readFileSync(resourcePath);
                    response.setHeader("Content-Length", data.length);
                    response.write(data);
                    response.end();
                } else {
                    console.error(`resource ${resName} does not exist !`.red)
                    response.writeHead(404, { "Content-Type": "text/plain" });
                    response.end("Not Found");
                }
            } catch (error) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                console.error("server internal error".red, error);
                response.end("server internal error" + error);
            }
        } else {
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            console.error("url is undefined".red);
            response.end("url is undefined");

        }
    });
}

function findFilePath(dirPath: string, fileName: string) {
    if (!fs.existsSync(dirPath)) {
        return "";
    }
    const stats = fs.readdirSync(dirPath);
    for (let item of stats) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            const ret = findFilePath(itemPath, fileName) as string;
            if (ret.length != 0) {
                return ret;
            }
        } else {
            if (item.startsWith(`${fileName}.`) || item === fileName) {
                return path.join(dirPath, item);
            }
        }
    }
    return "";
}