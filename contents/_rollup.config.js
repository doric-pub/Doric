import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import bundles from './build/index'

export default bundles.map(bundle => {
    return {
        input: `build/${bundle}.js`,
        output: {
            format: "cjs",
            file: `bundle/${bundle}.js`,
            sourcemap: true,
        },
        plugins: [
            resolve({ jsnext: true, main: true }),
            commonjs()
        ],
        external: ['reflect-metadata', 'doric'],
    }
})