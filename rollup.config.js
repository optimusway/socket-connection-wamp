import typescript from 'rollup-plugin-typescript2';
import {uglify} from 'rollup-plugin-uglify';

export default {
  entry: './src/index.ts',

  output: {
    file: 'dist/bundle/socket-connection-wamp.js',
    format: 'umd',
    name: 'socket-connection-wamp',
    sourcemap: true
  },

  plugins: [
    typescript(),
    uglify()
  ]
}