const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(vert|frag|glsl|obj|txt)$/,
        use: 'raw-loader'
      },
      {
        test: /\.(jpe?g|png|flac|bin)$/,
        use: 'file-loader'
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    })
  ],
  devServer: {
    port: 8000,
    hot: true,
    disableHostCheck: true,
    contentBase: path.join(__dirname, 'public')
  }
}