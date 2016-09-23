// rollup.config.js
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: [ 'es2015-rollup' ],
      babelrc: false
    })
  ],
};
