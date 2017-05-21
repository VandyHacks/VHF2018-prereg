const path = require('path');

module.exports = {
  entry: path.join(__dirname, '/app/entry.js'),
  output: {
    path: path.join(__dirname, '/public/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
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
  resolve: {
    alias: { vue: 'vue/dist/vue.common.js' }
  }
};
