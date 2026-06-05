import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
const config = {
    input: 'dist/esm/index.js',
    output: {
        file: 'dist/mmpay-sdk.js',
        format: 'umd',
        name: 'MMPaySDK',
        sourcemap: true,
        exports: 'named',
    },
    plugins: [
        resolve({
            browser: true,
        }),
        commonjs(),
    ],
};
export default config;
