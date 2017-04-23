import Path from 'path'
import Webpack from 'webpack'
import Merge from 'webpack-merge'

import CommonConfig from './webpack.common.babel.js'

export default env => Merge(CommonConfig(env), {
    entry: {
        vote: './components/wrapper/wrapper.jsx'
    },

    plugins: [
        new Webpack.optimize.UglifyJsPlugin({
            comments: false
        })
    ],

    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    }
})