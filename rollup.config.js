const path = require('path')
const fs = require('fs')
import resolve from '@rollup/plugin-node-resolve'

export default [
    {
        input: "build/index.runtime.js",
        output: {
            name: "doric",
            format: "iife",
            file: "bundle/doric-sandbox.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
        ],
        onwarn: function(warning) {
            if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
            console.warn( warning.message );
        }
    },
    {
        input: "build/index.js",
        output: {
            format: "cjs",
            file: "bundle/doric-lib.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
        ],
        external: ['reflect-metadata'],
        onwarn: function(warning) {
            if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
            console.warn( warning.message );
        }
    },
    {
        input: "build/index.debug.js",
        output: {
            format: "cjs",
            file: "bundle/doric-vm.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
        ],
        external: ['ws'],
        onwarn: function(warning) {
            if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
            console.warn( warning.message );
        }
    },
]