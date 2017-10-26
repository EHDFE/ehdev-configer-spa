/**
 * Default Project Config
 */
module.exports = {
  type: 'spa',
  buildPath: 'dist',
  enableHotModuleReplacement: true,
  framework: 'react',
  htmlWebpackPlugin: {
    // true | 'head' | 'body' | false Inject all assets into the given template or templateContent
    // When passing true or 'body' all javascript resources will be placed at the bottom of the body element.
    // 'head' will place the scripts in the head element.
    inject: true,
    // Allows to control how chunks should be sorted before they are included to the html.
    // Allowed values: 'none' | 'auto' | 'dependency' |'manual' | {function}
    chunksSortMode: 'auto',
    // if true (default) try to emit the file only if it was changed.
    cache: true,
    // if true (default) errors details will be written into the HTML page.
    showErrors: true,
  },
  browerSupports: {
    DEVELOPMENT: ['last 2 versions'],
    PRODUCTION: ['last 2 versions'],
  },
  babelUseBuiltIns: true,
  // valid in dev environment
  https: false,
};
