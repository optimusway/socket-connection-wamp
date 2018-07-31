import typescript from 'rollup-plugin-typescript';
import {uglify} from 'rollup-plugin-uglify';

export default {
  entry: './src/index.ts',

  output: {
    file: 'dist/bundle/ws-connection.js',
    format: 'umd',
    name: 'ws-connection',
    sourcemap: true
  },

  plugins: [
    typescript({
      importHelpers: true,
        typescript: require('typescript')
    }),
    uglify()
  ]
}