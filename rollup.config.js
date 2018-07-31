import typescript from 'rollup-plugin-typescript';
import {uglify} from 'rollup-plugin-uglify';

export default {
  entry: './src/index.ts',

  output: {
    file: './index.js',
    format: 'umd',
    name: 'lib'
  },

  plugins: [
    typescript({
        typescript: require('typescript')
    }),
    uglify()
  ]
}