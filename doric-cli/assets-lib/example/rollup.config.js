import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import bundles from "./build/index";
import fs from "fs";
import path from "path";
import buble from "@rollup/plugin-buble";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";

function searchImages(dir, images) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchImages(path.join(dir, item), images);
    } else {
      if (fullPath.endsWith(".png")) {
        images.push(fullPath);
      }
    }
  });
  return images;
}

const allImages = [];
searchImages("src", allImages);

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

allImages.forEach((value) => {
  let path = __dirname + "/build/" + value;
  let index = path.lastIndexOf("/");
  mkdirsSync(path.substring(0, index));

  fs.copyFile(
    __dirname + "/" + value,
    __dirname + "/build/" + value,
    (error) => {
      console.log(error);
    }
  );
});

function readDirs(dirPath, files) {
  if (fs.statSync(dirPath).isDirectory()) {
    fs.readdirSync(dirPath).forEach((e) => {
      readDirs(path.join(dirPath, e), files);
    });
  } else {
    for (let bundle of bundles) {
      if (dirPath.match(new RegExp(`^${bundle}`))) {
        files.push(dirPath);
      }
    }
  }
}

const dirs = fs.readdirSync(".").filter((e) => {
  for (let bundle of bundles) {
    if (bundle.match(new RegExp(`^${e}/`))) {
      return true;
    }
  }
  return false;
});

const allFiles = [];

dirs.forEach((e) => {
  readDirs(e, allFiles);
});
export default allFiles
  .map((e) => e.replace(/\.tsx?$/, ""))
  .map((bundle) => {
    return {
      input: `build/${bundle}.js`,
      output: {
        format: "cjs",
        file: `bundle/${bundle}.js`,
        sourcemap: true,
      },
      plugins: [
        resolve({ mainFields: ["jsnext"] }),
        commonjs(),
        json(),
        image(),
      ],
      external: ["reflect-metadata", "doric", "templatelibrary"],
      onwarn: function (warning) {
        if (warning.code === "THIS_IS_UNDEFINED") {
          return;
        }
        console.warn(warning.message);
      },
    };
  });
// If need ES5 support enable following configs
// .concat(
//     allFiles
//         .map((e) => e.replace(/\.tsx?$/, ""))
//         .map(bundle => {
//             return {
//                 input: `build/${bundle}.js`,
//                 output: {
//                     format: "cjs",
//                     file: `bundle/${bundle}.es5.js`,
//                     sourcemap: true,
//                 },
//                 plugins: [
//                     resolve({ mainFields: ["jsnext"] }),
//                     commonjs(),
//                     json(),
//                     buble({
//                         transforms: { dangerousForOf: true }
//                     }),
//                     image(),
//                 ],
//                 external: ['reflect-metadata', 'doric'],
//                 onwarn: function (warning) {
//                     if (warning.code === 'THIS_IS_UNDEFINED') { return }
//                     console.warn(warning.message)
//                 }
//             }
//         }))
