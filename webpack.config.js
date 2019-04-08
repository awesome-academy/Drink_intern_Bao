const webpack = require('webpack');
const path = require('path');

const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const parts = require('./webpack.parts');

const paths = getPaths();

const lintStylesOptions = {
    context: path.resolve(__dirname, `${paths.app}/styles`),
    syntax: 'scss',
    emitErrors: false
    // fix: true,
};
const cssPreprocessorLoader = { loader: 'fast-sass-loader' };

const commonConfig = merge([
    {
        context: paths.app,
        resolve: {
            unsafeCache: true,
            symlinks: false
        },
        entry: `${paths.app}/scripts`,
        output: {
            path: paths.build,
            publicPath: parts.publicPath
        },
        stats: {
            warningsFilter: warning =>
                warning.includes('entrypoint size limit'),
            children: false,
            modules: false
        },
        plugins: [
            // new HtmlPlugin({
            //     template: './index.pug'
            // }),
            new StylelintPlugin(lintStylesOptions)
        ],
        module: {
            noParse: /\.min\.js/
        }
    },
    parts.loadPug(),
    parts.loadFonts({
        include: paths.app,
        options: {
            name: `${paths.fonts}/[name].[hash:8].[ext]`
        }
    })
]);

const pages = [
    parts.page({
        title: 'Home',
        entry: {
            home: paths.app + '/scripts/index.js'
        },
        template: path.join(paths.app, 'index.pug'),

        // An array of chunks to include in the page
        chunks: ['home', 'runtime', 'vendors']
    }),
    parts.page({
        title: 'Detail',
        path: 'detail',
        entry: {
            home: paths.app + '/scripts/index.js'
        },
        template: path.join(paths.app, 'detail.pug'),

        // An array of chunks to include in the page
        chunks: ['home', 'runtime', 'vendors']
    })
];

const productionConfig = merge([
    {
        mode: 'production',
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            runtimeChunk: 'single'
        },
        output: {
            chunkFilename: `${paths.js}/[name].[chunkhash:8].js`,
            filename: `${paths.js}/[name].[chunkhash:8].js`
        },
        performance: {
            hints: 'warning', // 'error' or false are valid too
            maxEntrypointSize: 100000, // in bytes
            maxAssetSize: 450000 // in bytes
        },
        plugins: [new webpack.HashedModuleIdsPlugin(), new ManifestPlugin()]
    },
    // parts.loadJS({
    // 	include: paths.app,
    // 	options: {
    // 		cacheDirectory: true
    // 	}
    // }),
    parts.extractCSS({
        include: paths.app,
        use: [parts.autoprefix(), cssPreprocessorLoader],
        options: {
            filename: `${paths.css}/[name].[contenthash:8].css`,
            chunkFilename: `${paths.css}/[id].[contenthash:8].css`
        }
    }),

    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true
            }
        }
    }),
    parts.loadImages({
        include: paths.app,
        options: {
            limit: 15000,
            name: `${paths.images}/[name].[hash:8].[ext]`
        }
    }),
    // should go after loading images
    parts.optimizeImages()
]);
const developmentConfig = merge([
    {
        mode: 'development'
    },
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
    }),
    parts.loadCSS({ include: paths.app, use: [cssPreprocessorLoader] }),
    parts.loadImages({ include: paths.app })
    // parts.loadJS({ include: paths.app })
]);

module.exports = env => {
    process.env.NODE_ENV = env;

    const config = env === 'production' ? productionConfig : developmentConfig;

    // 3. Merge these pages into the final config
    return merge(commonConfig, config, ...pages);
};
function getPaths({
    sourceDir = 'app',
    buildDir = 'build',
    staticDir = '',
    images = 'images',
    fonts = 'fonts',
    js = 'scripts',
    css = 'styles'
} = {}) {
    const assets = { images, fonts, js, css };

    return Object.keys(assets).reduce(
        (obj, assetName) => {
            const assetPath = assets[assetName];

            obj[assetName] = !staticDir
                ? assetPath
                : `${staticDir}/${assetPath}`;

            return obj;
        },
        {
            app: path.join(__dirname, sourceDir),
            build: path.join(__dirname, buildDir),
            staticDir
        }
    );
}
