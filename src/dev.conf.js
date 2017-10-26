/**
 * development config
 */
const path = require('path');
const webpack = require(process.env.WEBPACK_PATH);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { camelCase } = require('lodash');
const autoprefixer = require('autoprefixer');

const { PROJECT_ROOT, APP_DIR, getFilesByExtName, SOURCE_DIR } = require('./lib');
const PUBLIC_PATH = '/';

module.exports = async (PROJECT_CONFIG, options) => {
  const BUILD_PATH = path.join(PROJECT_ROOT, PROJECT_CONFIG.buildPath);
  
  const configResult = {};
  
  const fileList = await getFilesByExtName(APP_DIR, ['html', 'htm']);
  const appPages = fileList.map(page => ({
    page,
    name: camelCase(page.replace(/\.html?$/, '')),
  }));

  // entry config
  const entry = {};

  appPages.forEach(d => {
    const scripts = [
      path.join(APP_DIR, `${d.name}.js`),
    ];
    if (PROJECT_CONFIG.enableHotModuleReplacement) {
      scripts.unshift(
        `${require.resolve('webpack-dev-server/client')}?http://localhost:${options.port}`,
        require.resolve('webpack/hot/dev-server'),
      );
      if (PROJECT_CONFIG.framework === 'react') {
        scripts.unshift(require.resolve('react-hot-loader/patch'));
      }
    }
    Object.assign(entry, {
      [d.name]: scripts,
    });
  });

  // output config
  const output = {
    path: BUILD_PATH,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    publicPath: PUBLIC_PATH,
  };

  // module config
  const module = {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: '[name].[hash:8].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.jsx?$/,
            include: SOURCE_DIR,
            loader: require.resolve('babel-loader'),
            options: {
              // @remove-on-eject-begin
              babelrc: false,
              presets: [
                [
                  require.resolve('babel-preset-env'),
                  {
                    targets: {
                      browsers: PROJECT_CONFIG.browerSupports.DEVELOPMENT,
                    }, 
                    module: false,
                    useBuiltIns: PROJECT_CONFIG.babelUseBuiltIns,
                  }
                ]
              ].concat(
                PROJECT_CONFIG.framework === 'react' ? [
                  require.resolve('babel-preset-react'),
                  require.resolve('babel-preset-stage-1'),
                ] : [
                  require.resolve('babel-preset-stage-1'),
                ]
              ),
              // @remove-on-eject-end
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
            },
          },
          {
            test: /\.(le|c)ss$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: false,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    autoprefixer({
                      browsers: PROJECT_CONFIG.browerSupports.DEVELOPMENT,
                    }),
                  ],
                },
              },
              {
                loader: require.resolve('less-loader'),
              }
            ],
          },
          {
            test: /\.html?$/,
            use: [
              {
                loader: require.resolve('html-loader'),
                options: {
                  interpolate: true,
                  root: './',
                },
              },
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.jsx?$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
      }
    ]
  };

  // plugins config
  const plugins = [];
  
  appPages.forEach(d => {
    plugins.push(
      new HtmlWebpackPlugin(Object.assign({
        filename: d.page,
        template: path.join(APP_DIR, d.page),
        chunks: [
          // 'assets/commonLibs',
          d.name,
        ],
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: false,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }, PROJECT_CONFIG.htmlWebpackPlugin))
    );
  });
  plugins.push(
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
  );

  Object.assign(configResult, {
    entry,
    output,
    module,
    plugins,
    devtool: 'cheap-module-source-map',
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  });

  return configResult;
};