const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const SHELL_NODE_MODULES_PATH = process.env.SHELL_NODE_MODULES_PATH;
const webpack = require(path.join(SHELL_NODE_MODULES_PATH, 'webpack'));

const PROJECT_ROOT = exports.PROJECT_ROOT = process.cwd();
const SOURCE_DIR = exports.SOURCE_DIR = path.join(PROJECT_ROOT, 'src');
const APP_DIR = exports.APP_DIR = path.join(SOURCE_DIR, 'app');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

exports.getFilesByExtName = async (pathname, extname) => {
  const extnames = Array.isArray(extname) ? extname : [ extname ];
  const fileList = [];
  try {
    const files = await readdir(pathname);
    for (const file of files) {
      const filepath = path.join(pathname, file);
      if (extnames.some(ext => file.endsWith(`.${ext}`))) {
        const fileStat = await stat(filepath);
        if (fileStat.isFile()) {
          fileList.push(file);
        }
      }
    }
  } catch(e) {}

  return fileList;
};

exports.getHtmlLoaderConfig = PROJECT_CONFIG => ({
  test: /\.html?$/,
  use: [
    {
      loader: require.resolve('html-loader'),
      options: {
        interpolate: true,
        root: './',
      },
    },
    {
      loader: require.resolve('posthtml-loader'),
      options: {
        plugins: [
          require('posthtml-expressions')({
            locals:{
              env: process.env.NODE_ENV, 
            },
            delimiters: ['<%', '%>'],
          })
        ],
      },
    },
  ],
});

exports.getLoaderOptionPlugin = PROJECT_CONFIG => new webpack.LoaderOptionsPlugin({
  options: {
    posthtml(ctx) {
      return {
        plugins: [
          require('posthtml-expressions')({
            locals:{
              env: process.env.NODE_ENV, 
            },
            delimiters: ['<%', '%>'],
          })
        ],
      };
    }
  },
});
