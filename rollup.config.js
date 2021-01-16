import babel from '@rollup/plugin-babel';
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "main.js",
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    commonjs()
  ]
};
