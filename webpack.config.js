const path = require('path');
const joinRelPath = relPath => path.join(__dirname, relPath);

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
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  }
};
