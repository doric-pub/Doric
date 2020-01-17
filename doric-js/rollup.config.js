import resolve from '@rollup/plugin-node-resolve'
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs'

export default [
    {
        input: "lib/index.runtime.js",
        output: {
            name: "doric",
            format: "iife",
            file: "bundle/doric-sandbox.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
        ],
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') { return; }
            console.warn(warning.message);
        }
    },
    {
        input: "lib/index.js",
        output: {
            format: "cjs",
            file: "bundle/doric-lib.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
        ],
        external: ['reflect-metadata'],
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') { return; }
            console.warn(warning.message);
        }
    },
    {
        input: "lib/index.debug.js",
        output: {
            format: "cjs",
            file: "bundle/doric-vm.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
        ],
        external: ['ws'],
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') { return; }
            console.warn(warning.message);
        }
    },

    {
        input: "lib-es5/index.runtime.es5.js",
        output: {
            name: "doric",
            format: "iife",
            file: "bundle/doric-sandbox.es5.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
            commonjs(),
            buble({
                transforms: { dangerousForOf: true }
            }),
        ],
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') { return; }
            console.warn(warning.message);
        }
    },
    {
        input: "lib-es5/index.js",
        output: {
            format: "cjs",
            file: "bundle/doric-lib.es5.js",
        },
        plugins: [
            resolve({ mainFields: ["jsnext"] }),
            buble({
                transforms: { dangerousForOf: true }
            }),
        ],
        external: ['reflect-metadata'],
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') { return; }
            console.warn(warning.message);
        }
    },
]