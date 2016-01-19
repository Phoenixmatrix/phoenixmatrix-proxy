import webpack from 'webpack';
import path from 'path';

const config = {
  entry: {
    renderer: [
      './src/app'
    ]
  },
  target: 'electron',
  output: {
    path: './dist',
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
    publicPath: 'dist/'
  },
  debug: true,
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.less$/,
        loader: 'style!css?url=false&import=false!less'
      },
      {
        test: /\.css$/,
        loader: 'style!css?url=false&import=false'
      },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ],
    noParse: ['^./vendor']
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.less', '.css']
  },
  externals: ['node-forge']
};


module.exports = config;
