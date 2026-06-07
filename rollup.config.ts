import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/esm/index.js',
      format: 'es'
    },
    {
      file: 'dist/mmpay-sdk.js',
      format: 'umd',
      name: 'MMPaySDK',
      exports: 'named'
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        // This stops Rollup from fighting with tsc over declaration outputs
        outDir: 'dist',
        declaration: false,
        declarationMap: false,
        declarationDir: undefined
      }
    })
  ]
};
