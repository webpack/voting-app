import Path from 'path'
import Webpack from 'webpack'

export default (env = {}) => ({
    context: Path.resolve(__dirname, './src'),
    entry: {
        index: './app.jsx'
    },

    resolve: {
        symlinks: false,
        extensions: [ '.js', '.jsx', '.scss' ],
        alias: {
            Components: Path.resolve(__dirname, './src/components'),
            Utils: Path.resolve(__dirname, './src/utils')
        }
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader', 
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                            configFile: Path.resolve(__dirname, './.eslintrc')
                        }
                    }
                ]
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    'postcss-loader', 
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                Path.resolve(__dirname, './src/utils/scss') 
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: [
                    'file-loader',
                    'image-webpack-loader'
                ]
            }
        ]
    },

    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': env.dev ? `'development'` : `'production'` 
        })
    ],

    output: {
        path: Path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'app.min.js'
    }
})