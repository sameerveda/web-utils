const { existsSync } = require('fs');
const { resolve } = require('path');

const esbuild_default_loaders = {
  '.html': 'text',
  '.png': 'dataurl',
  '.woff': 'file',
  '.woff2': 'file',
  '.eot': 'file',
  '.ttf': 'file',
  '.svg': 'file',
};

const postcssPlugin = (...args) => require('./esbuild/postcss-plugin')(...args);

const sveltePlugin = (...args) =>
  require('esbuild-svelte')(
    ...(args.length === 0
      ? [
          require(existsSync('./svelte.config.js')
            ? resolve('./svelte.config.js')
            : './svelte.config.js'),
        ]
      : args)
  );

/**
 * @param {import('serve-http').ServerConfig} config
 */
const startServeHttp = (config = {}) => {
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

/**
 *
 * @param {Parameters<import('esbuild').build>[0]} config
 * @returns
 */
const esbuildDefaultConfig = (isDev, config) => {
  if (!config.entryPoints) {
    const files = ['./src/app.js', './src/main.js', './src/index.js'].flatMap(t => [
      t,
      t.replace('.js', '.ts'),
    ]);

    config.entryPoints = files.find(existsSync);
    if (!config.entryPoints)
      throw new Error('entryPoints not found, checked: ' + JSON.stringify(files));

    config.entryPoints = [config.entryPoints];
  }

  if (!config.outdir) config.outdir = isDev ? 'public/build' : 'dist';
  if (!config.plugins) config.plugins = s => s;
  if (typeof config.plugins === 'function')
    config.plugins = config.plugins([postcssPlugin(), sveltePlugin()]);

  console.log({
    entryPoints: config.entryPoints,
    outdir: config.outdir,
    isDev,
    // Nullish coalescing wont work here, since watch is allowed to override even if watch = null .
    watch: 'watch' in config ? config.watch : isDev,
  });

  return {
    bundle: true,
    logLevel: 'debug',
    loader: esbuild_default_loaders,
    minify: !isDev,
    watch: isDev,
    ...config,
  };
};

module.exports = {
  esbuild_default_loaders,
  postcssPlugin,
  sveltePlugin,
  startServeHttp,
  esbuildDefaultConfig,
};
