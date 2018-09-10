import typescript from 'rollup-plugin-typescript2';
import {uglify} from 'rollup-plugin-uglify';

export default {
  entry: './src/index.ts',

  output: {
    file: 'dist/bundle/subzero-wamp.js',
    format: 'umd',
    name: 'subzero-wamp',
    sourcemap: true
  },

  plugins: [
    typescript(),
    uglify()
  ]
}