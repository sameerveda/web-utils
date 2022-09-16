const esbuild = require('esbuild');
const { writeFileSync, writeFile } = require('fs');
const package = require('./package.json');
const alias = require('esbuild-plugin-alias');
const { join } = require('path');
const {
  esbuild_default_loaders,
  sveltePlugin,
  postcssPlugin,
  startServeHttp,
} = require('./esbuild-init');

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
      inject: ['./firebaseConfig.js'],
      bundle: true,
      format,
      loader: esbuild_default_loaders,
      minify: !dev,
      watch: dev,
      plugins: [
        alias({ 'lodash-es': join(__dirname, 'node_modules/lodash/lodash.js') }),
        postcssPlugin(),
        sveltePlugin(),
      ],
    })
    .then(() => dev && startServeHttp());

// builder('esm');
// prod && builder('iife');

builder('iife');
