import Path from 'path'
import Webpack from 'webpack'
import HTMLPlugin from 'html-webpack-plugin'
import HTMLTemplate from 'html-webpack-template'
import Merge from 'webpack-merge'

import CommonConfig from './webpack.common.babel.js'

export default env => Merge(CommonConfig(env), {
    devtool: 'source-map',
    entry: './app.jsx',

    plugins: [
        new HTMLPlugin({
            inject: false,
            template: HTMLTemplate,

            title: 'webpack | vote (dev-mode)',
            appMountId: 'root',
            mobile: true,
            favicon: './favicon.ico'
        }),

        new Webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        hot: true,
        port: 3030,
        inline: true,
        compress: true,
        historyApiFallback: true,
        contentBase: Path.resolve(__dirname, './dist')
    }
})