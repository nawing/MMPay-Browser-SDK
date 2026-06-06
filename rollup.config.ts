import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/mmpay-sdk.js',
      format: 'umd',
      name: 'MMPaySDK'
    },
    {
      file: 'dist/mmpay-sdk.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        outDir: 'dist',
        declaration: false,
        declarationMap: false,
        declarationDir: undefined
      }
    })
  ]
};
