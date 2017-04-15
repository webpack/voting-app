import Path from 'path'
import Webpack from 'webpack'
import Merge from 'webpack-merge'

import CommonConfig from './webpack.common.babel.js'

export default env => Merge(CommonConfig(env), {
    plugins: [
        new Webpack.optimize.UglifyJsPlugin({
            comments: false
        })
    ]
})