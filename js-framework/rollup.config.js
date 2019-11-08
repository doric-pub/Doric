const path = require('path')
const fs = require('fs')
import resolve from 'rollup-plugin-node-resolve'

export default [
    {
        input: "build/index.runtime.js",
        output: {
            name: "doric",
            format: "iife",
            file: "bundle/doric-sandbox.js",
        },
        plugins: [
            resolve({ jsnext: true, main: true }),
        ]
    },
    {
        input: "build/index.js",
        output: {
            format: "cjs",
            file: "bundle/doric-lib.js",
        },
        plugins: [
            resolve({ jsnext: true, main: true }),
        ],
        external: ['reflect-metadata']
    },
    {
        input: "build/index.debug.js",
        output: {
            format: "cjs",
            file: "bundle/doric-vm.js",
        },
        plugins: [
            resolve({ jsnext: true, main: true }),
        ],
        external: ['ws']
    },
]