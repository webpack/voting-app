import Path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default (env = {}) => ({
    context: Path.resolve(__dirname, './src'),

    mode: env.dev ? 'development' : 'production',

    resolve: {
        symlinks: false,
        extensions: ['.js', '.jsx', '.scss'],
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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')
                            ],
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [Path.resolve(__dirname, './src/utils/scss')]
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: 'file-loader'
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.min.css'
        })
    ],

    output: {
        path: Path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'vote.bundle.js',
        library: 'vote',
        libraryTarget: 'umd'
    },

    stats: {
        children: false
    }
})
