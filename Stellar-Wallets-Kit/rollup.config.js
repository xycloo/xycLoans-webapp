import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'build/index.js',
    output: [
      {
        file: 'build/web-bundle.js',
        format: 'umd',
        name: 'SWK',
      },
    ],
    plugins: [commonjs({ extensions: ['.js', '.ts'] }), nodeResolve()],
  },
];
