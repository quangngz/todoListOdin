const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, 
    publicPath:"./"
    },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ], 
devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
  },
};