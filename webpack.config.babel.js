import webpack from 'webpack';
import path from 'path';

const config = {
  entry: {
    renderer: [
      './src/app'
    ]
  },
  output: {
    path: './dist',
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
    publicPath: 'http://localhost:8080/'
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
        loaders: [
          'style',
          'css?sourcemap&modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'less?sourceMap'
        ]
      },
      {
        test: /\.css$/,
        loader: 'style!css?sourcemap'
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
  externals: ['node-forge', 'fs', 'net', 'tls', 'http', 'https'],
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};


module.exports = config;
