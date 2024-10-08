const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer')
]

class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', function () {
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: [{ loader: "css-loader", options: { url: false } }, { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }]

}

let pages = fse.readdirSync('./app').filter(function (file) {
    return file.endsWith('.html')
}).map(function (page) {
    return new HtmlWebpackPlugin({
        filenam: page,
        template: `./app/${page}`
    })
})

let config = {
    entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig,
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            }
        ]
    }
}

if (currentTask == 'dev') {
    cssConfig.use.unshift('style-loader')
    config.output = {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    }
    config.devServer = {
        setupMiddlewares: (middlewares, devServer) => {
            devServer.watchFiles('app/**/*.html')
            return middlewares
        },
        static: {
            directory: path.join(__dirname, 'app'),
        },
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    }
    config.mode = 'development'

}


if (currentTask == 'build') {
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    postCSSPlugins.push(require('cssnano'))
    config.output = {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'docs'),

    }
    config.mode = 'production'
    config.optimization = {
        splitChunks: { chunks: 'all', minSize: 1000 },

    }
    config.plugins.push(
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: 'style.[chunkhash].css' }),
        new RunAfterCompile()
    )
}


module.exports = config