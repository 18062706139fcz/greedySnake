/*
 * @Author: 18062706139 2279549769@qq.com
 * @Date: 2022-08-31 21:36:04
 * @LastEditors: 18062706139 2279549769@qq.com
 * @LastEditTime: 2022-09-01 14:29:13
 * @FilePath: /snacks/webpack.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')

const { cleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    // 指定入口文件
    entry: './src/index.ts',
    // 指定打包文件所在目录
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        // environment:{arrowFunction: false}
    },

    // webpack打包时使用的模块
    module: {
        // 指定loader的规则
        rules: [
            {
                // 指定规则生效的文件
                test: /\.ts$/,
                // 从后往前执行
                use: [{
                    // 指定加载器
                    loader: 'babel-loader',
                    // 设置 babel
                    options: {
                        presets: [
                            [
                                // 指定环境插件
                                "@babel/preset-env",
                                // 配置信息
                                {
                                    // 要兼容的目标浏览器
                                    targets: {
                                        "chrome": "58",
                                        "ie": '11'
                                    },
                                    // 使用啥版本的
                                    "corejs": "3",
                                    // usage表示 按需加载
                                    "useBuiltIns": "usage" 
                                }
                            ]
                        ]
                    }
                },
                'ts-loader'],
                exclude: /node_modules/
            },
            
            // less文件处理
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    // 引入postcss // 未解决，兼容性问题
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         postcssOptions: {
                    //             plugins: [
                    //                 "postcss-preset-env",
                    //                 {
                    //                     browsers: 'last 2 versions'
                    //                 }
                    //             ]
                    //         }
                    //     }
                    // },
                    "less-loader"
                ]
            }
        ]
    },
    // 配置Webpack插件
    plugins: [
        // 生成了 html
        // new cleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // title: "这是一个自定义的title"
            template: './src/index.html'
        }),
        
    ],
    mode: 'development',
    // 用来设置引用模块
    resolve: {
        extensions: ['.ts', '.js']
    }
}