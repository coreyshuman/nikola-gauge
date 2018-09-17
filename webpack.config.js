const path = require('path');

module.exports = {
  entry: './build-babel/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "source-map"
};
