const webpack = require('webpack')
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');

const common = {
  context: __dirname + '/client',
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        // include: SRC_DIR,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(), //dedupe similar code 
    new webpack.optimize.UglifyJsPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks 
    new CompressionPlugin({ 
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const client = {
  entry: './client-output.js',
  output: {
    path: DIST_DIR,
    filename: 'app.js'
  }
};

const server = {
  entry: './server-output.js',
  target: 'node',
  output: {
    path: DIST_DIR ,
    filename: 'app-server.js',
    libraryTarget: 'commonjs-module'
  }
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];

// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// module.exports = {
//   entry: './client/src/index.jsx',
//   output: {
//     filename: 'bundle.js',
//     path: DIST_DIR,
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?/,
//         include: SRC_DIR,
//         loader: 'babel-loader',
//         query: {
//           presets: ['react', 'es2015', 'stage-0'],
//         },
//       },
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader'
//         ]
//       },
//     ],
//   },
//   plugins: [
//     new webpack.DefinePlugin({ // <-- key to reducing React's size
//       'process.env': {
//         'NODE_ENV': JSON.stringify('production')
//       }
//     }),
//     new webpack.optimize.DedupePlugin(), //dedupe similar code 
//     new webpack.optimize.UglifyJsPlugin(), //minify everything
//     new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks 
//     new CompressionPlugin({ 
//       asset: "[path].gz[query]",
//       algorithm: "gzip",
//       test: /\.js$|\.css$|\.html$/,
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   ],
//   resolve: {
//     extensions: ['.js', '.jsx'],
//   },
// };
