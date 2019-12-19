import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import jsonPlugin from 'rollup-plugin-json'
import fs from 'fs'
import path from 'path'

const sandboxBundle = fs.readFileSync(path.resolve("./node_modules/doric/bundle/doric-sandbox.js"), 'utf-8')

const doricLibBundle = fs.readFileSync(path.resolve("./node_modules/doric/bundle/doric-lib.js"), 'utf-8')

export default {
    input: `build/index.js`,
    output: {
        format: "iife",
        name: "index",
        file: `dist/index.js`,
        sourcemap: true,
        banner: sandboxBundle,
        globals: {
            doric: "doric_lib",
            'doric/src/runtime/sandbox': 'doric',
            doricLibBundle
        },
    },
    plugins: [
        resolve({ mainFields: ["jsnext"] }),
        commonjs(),
        jsonPlugin(),
    ],
    external: ['axios', 'reflect-metadata', 'doric'],
    onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') { return; }
        console.warn(warning.message);
    },
}