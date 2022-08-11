const fs = require("fs");

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
}

work();
