const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
let commonConfig = require("./common.config.js")();

commonConfig.optimization = {
  minimizer: [
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        ecma: 6,
        compress: {
          drop_debugger: true,
          warnings: false,
          dead_code: true,
          unused: true,
          global_defs: {
            DEBUG: false
          }
        },
        comments: false,
        sourceMap: false
      },
      cache: true
    }),
    new OptimizeCSSAssetsPlugin({}) // use OptimizeCSSAssetsPlugin
  ]
};

const { STATIC_PREFIX, allEnv } = require("./env");
// 静态资源前缀不加 /，因为原本就是绝对路径
const staticPrefix = STATIC_PREFIX ? STATIC_PREFIX : "";

commonConfig.mode = "production";
// Absolute output directory
commonConfig.output.publicPath = staticPrefix + commonConfig.output.publicPath;

commonConfig.plugins.push(
  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  new HtmlWebpackPlugin({
    filename: "index.html.tmpl",
    template: "./src/index.html",
    inject: "body",
    favicon: "./src/favicon.ico"
  }),
  // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
  new webpack.DefinePlugin({
    ...allEnv,
    DEBUG: false
  }),

  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[name].css"
  })
);

module.exports = commonConfig;
