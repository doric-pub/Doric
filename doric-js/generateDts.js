const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function work() {
  const imageDts = await fs.promises.readFile("src/image.d.ts", "utf-8");
  const indexDts = await fs.promises.readFile("index.d.ts", "utf-8");
  const content = `declare module "doric" {
${indexDts
  .replace(/\sdeclare\s/g, " ")
  .split("\n")
  .map((e) => `	${e}`)
  .join("\n")}
}
${imageDts}
  `;
  await fs.promises.writeFile("index.d.ts", content);
  const destFile = "../doric-ohos/doric/index.d.ts";
  await fs.promises.writeFile(
    destFile,
    `declare module "@ohos/doric" {
    ${indexDts
      .replace(/\sdeclare\s/g, " ")
      .split("\n")
      .map((e) => `	${e}`)
      .join("\n")}
    }
    ${imageDts}
      `
  );
  const files = [
    "bundle/doric-lib.js",
    "bundle/doric-sandbox.js",
    "bundle/doric-web.js",
    "bundle/doric-web.html",
  ];
  const androidAssets = "../doric-android/doric/src/main/assets";
  for (let file of files) {
    const md5 = crypto.createHash("md5");
    md5.update(path.basename(file));
    const name = md5.digest("hex").toLowerCase();
    const data = await fs.promises.readFile(file);
    const temp = new Uint8Array(data.buffer);
    for (let i = 0; i < temp.length; i++) {
      temp[i] = 0xff - temp[i];
    }
    await fs.promises.writeFile(path.resolve(androidAssets, name), data);
  }
}

work();
