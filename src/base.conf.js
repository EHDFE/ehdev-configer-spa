/**
 * Base Config
 * TODO:
 * 1. introduce eslint
 */
const path = require('path');
const SHELL_NODE_MODULES_PATH = process.env.SHELL_NODE_MODULES_PATH;
const webpack = require(path.join(SHELL_NODE_MODULES_PATH, 'webpack'));
const { SOURCE_DIR } = require('./lib');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = async (PROJECT_CONFIG, options) => {
  return {
    entry: {},
    output: {},
    resolve: {
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebookincubator/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    },
    module: {
      strictExportPresence: true,
    },
    externals: {},
    target: 'web',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
      }),
      new CaseSensitivePathsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
