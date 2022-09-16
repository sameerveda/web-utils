module.exports.esbuild_default_loaders = {
  '.html': 'text',
  '.png': 'dataurl',
  '.woff': 'file',
  '.woff2': 'file',
  '.eot': 'file',
  '.ttf': 'file',
  '.svg': 'file',
};

module.exports.postcssPlugin = (...args) => require('./esbuild/postcss-plugin')(...args);

module.exports.sveltePlugin = (...args) =>
  require('esbuild-svelte')(...(args.length === 0 ? [require('./svelte.config.js')] : args));

/**
 * @param {import('serve-http').ServerConfig} config
 */
module.exports.startServeHttp = (config = {}) => {
  config = {
    port: 3000,
    quiet: true,
    pubdir: require('path').resolve('./public'),
    ...config,
  };
  const server = require('serve-http').createServer(config);
  console.info('server started at http://localhost:' + config.port);

  return server;
};
