const esbuild = require('esbuild');
const { writeFileSync, writeFile } = require('fs');
const package = require('./package.json');
const alias = require('esbuild-plugin-alias');
const { join } = require('path');
const {
  sveltePlugin,
  postcssPlugin,
  startServeHttp,
  esbuildDefaultConfig,
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

esbuild
  .build(
    esbuildDefaultConfig(dev, {
      entryPoints: [
        process.argv.includes('--component-test') ? './src/component-test.js' : './src/app.js',
      ],
      inject: ['./firebaseConfig.js'],
      plugins: defaultPlugins => [
        alias({ 'lodash-es': join(__dirname, 'node_modules/lodash/lodash.js') }),
        ...defaultPlugins,
      ],
    })
  )
  .then(() => dev && startServeHttp());
