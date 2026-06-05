"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
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
        (0, plugin_node_resolve_1.default)({
            browser: true,
        }),
        (0, plugin_commonjs_1.default)(),
    ],
};
exports.default = config;
