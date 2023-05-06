import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

/* https://www.rollupjs.com/guide/big-list-of-options */
export default [
  {
    // 入口文件
    input: 'packages/vue/src/index.ts',
    output: [
      // 导出iife模式包
      {
        // 开启sourcemap
        sourcemap: true,
        // 导出文件地址
        file: './packages/vue/dist/vue.js',
        // 生成包的格式
        format: 'iife',
        // 变量名
        name: 'Vue'
      },
      {
        // 开启sourcemap
        sourcemap: true,
        // 导出文件地址
        file: './packages/vue/dist/vue.esm.js',
        // 生成包的格式
        format: 'es',
        // 变量名
        name: 'Vue'
      }
    ],
    // 插件
    plugins: [
      // ts 支持
      typescript({
        sourceMap: true
      }),
      resolve(), // 模块导入的路径补全
      commonjs() // 将commonjs模块转换为ES2015
    ]
  }
]