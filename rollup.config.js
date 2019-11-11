import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';

import pkg from './package.json';

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    url(),
    svgr(),
    typescript({
      tsconfig: 'tsconfig.json',
      objectHashIgnoreUnknownHack: true,
      clean: process.env.TS_ROLLUP_CLEAN === 'true',
    }),
    babel(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  external: (id) => (
    external.includes(id)
    || id.match(/date-fns\//)
  ),
};
