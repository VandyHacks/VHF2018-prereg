const path = require('path');
const joinRelPath = relPath => path.join(__dirname, relPath);
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: joinRelPath('/app/entry.js'),
  output: {
    path: joinRelPath('/public/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
