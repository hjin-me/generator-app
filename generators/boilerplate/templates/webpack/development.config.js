const webpack = require("webpack");
const path = require("path");
const devServerConfig = require("./common.config.js")();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { envDefine, env } = require("./env");

devServerConfig.mode = "development";
devServerConfig.cache = true;
devServerConfig.devtool = "inline-source-map";

devServerConfig.plugins.push(
  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "./src/index.html",
    inject: "body",
    favicon: "./src/favicon.ico"
  }),

  // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
  new webpack.DefinePlugin({
    ...envDefine(),
    DEBUG: true
  }),
  new webpack.LoaderOptionsPlugin({
    debug: true
  }),
  new MiniCssExtractPlugin({
    filename: "[name].bundle.css",
    chunkFilename: "[name].css"
  })
);

devServerConfig.output.publicPath = `https://dev.jinh.me:8443${path.posix.join(
  "/static",
  env("PROJECT_NAME")
)}/`;

devServerConfig.devServer = {
  public: "dev.jinh.me:8443",
  contentBase: path.join(__dirname, "..", "dist"),
  overlay: true,
  historyApiFallback: {
    index: path.posix.join("/static", env("PROJECT_NAME"), "index.html")
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-Requested-With, Content-Type, Authorization"
  },
  stats: {
    modules: false,
    cached: false,
    colors: true,
    chunk: false
  },
  host: "0.0.0.0",
  disableHostCheck: true,
  port: 8765
};

module.exports = devServerConfig;
