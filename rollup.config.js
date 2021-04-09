import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import ts from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'
import { createFilter } from '@rollup/pluginutils'

const include = 'src/**.ts'
const exclude = 'node_modules/**'
const filter = createFilter(include, exclude, {});

const getPath = _path => path.resolve(__dirname, _path)

// ts
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
})

export default {
  input: 'src/index.ts',
  output: {
    name: 'sequence',
    file: 'lib/index.js',
    format: 'umd',
  },
  plugins: [
    resolve(),
    babel({
      // include: 'src/*.ts',
      // exclude: ['node_modules/**', 'lib/**']
      filter,
      babelHelpers: 'external',
    }),
    tsPlugin,
    commonjs(),
  ]
}