import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import bundles from './build/index'
import fs from 'fs'
import path from 'path'
import buble from '@rollup/plugin-buble';

function readDirs(dirPath, files) {
    if (fs.statSync(dirPath).isDirectory()) {
        fs.readdirSync(dirPath).forEach(e => {
            readDirs(path.join(dirPath, e), files)
        })
    } else {
        for (let bundle of bundles) {
            if (dirPath.match(new RegExp(`^${bundle}`))) {
                files.push(dirPath)
            }
        }
    }
}


const dirs = fs.readdirSync('.')
    .filter(e => {
        for (let bundle of bundles) {
            if (bundle.match(new RegExp(`^${e}/`))) {
                return true
            }
        }
        return false
    })

const allFiles = []

dirs.forEach(e => {
    readDirs(e, allFiles)
})
export default
    allFiles
        .map(e => e.replace('.ts', ''))
        .map(bundle => {
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
                ],
                external: ['reflect-metadata', 'doric'],
                onwarn: function (warning) {
                    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
                    console.warn(warning.message);
                }
            }
        }).concat(
            allFiles
                .map(e => e.replace('.ts', ''))
                .map(bundle => {
                    return {
                        input: `build/${bundle}.js`,
                        output: {
                            format: "cjs",
                            file: `bundle/${bundle}.es5.js`,
                            sourcemap: true,
                        },
                        plugins: [
                            resolve({ mainFields: ["jsnext"] }),
                            commonjs(),
                            buble({
                                transforms: { dangerousForOf: true }
                            }),
                        ],
                        external: ['reflect-metadata', 'doric'],
                        onwarn: function (warning) {
                            if (warning.code === 'THIS_IS_UNDEFINED') { return; }
                            console.warn(warning.message);
                        }
                    }
                }))