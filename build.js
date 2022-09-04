const sveltePlugin = require('esbuild-svelte');
const esbuild = require('esbuild');
const { writeFileSync, writeFile } = require('fs');
const package = require('./package.json');
const alias = require('esbuild-plugin-alias');
const { join } = require('path');

const dev = process.argv.includes('--dev');
const prod = !dev;

if (prod) {
  package.version = package.version.split('.');
  package.version[package.version.length - 1] = `${
    +package.version[package.version.length - 1] + 1
  }`;
  package.version = package.version.join('.');
  writeFileSync('./package.json', JSON.stringify(package, null, 2));
}

writeFileSync(
  './src/utils/env.js',
  `export default ${JSON.stringify({
    isDev: dev,
    buildTime: new Date().toISOString(),
    version: package.version,
  })}`
);

const builder = format =>
  esbuild
    .build({
      entryPoints: ['src/app.js'],
      outdir: prod ? 'dist' : 'public/build',
      outExtension: { '.js': `.${format}.js` },
      bundle: true,
      format,
      loader: {
        '.html': 'text',
        '.png': 'dataurl',
        '.woff': 'file',
        '.woff2': 'file',
        '.eot': 'file',
        '.ttf': 'file',
        '.svg': 'file',
      },
      minify: !dev,
      watch: dev,
      plugins: [
        alias({ 'lodash-es': join(__dirname, 'node_modules/lodash/lodash.js') }),
        sveltePlugin(),
      ],
    })
    .then(() => {
      if (!dev) return;

      require('serve-http').createServer({
        port: 3000,
        quiet: true,
        pubdir: require('path').join(__dirname, 'public'),
      });
      console.log('server started at http://localhost:3000');
    });

builder('esm');
prod && builder('iife');
