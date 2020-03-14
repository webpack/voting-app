import Merge from 'webpack-merge'
import cssnano from 'cssnano'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import CommonConfig from './webpack.common.babel.js'

export default env => Merge(CommonConfig(env), {
    entry: './components/wrapper/wrapper.jsx',

    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    },

    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/g,
            cssProcessor: cssnano
        })
    ]
})