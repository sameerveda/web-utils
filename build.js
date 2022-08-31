const sveltePlugin = require('esbuild-svelte');
const esbuild = require('esbuild');
const { writeFileSync } = require('fs');
const package = require('./package.json');

const dev = process.argv.includes('--dev');
const prod = process.argv.includes('--prod');

if (prod) {
  package.version = package.version.split('.');
  package.version[package.version.length - 1] = `${
    +package.version[package.version.length - 1] + 1
  }`;
  package.version = package.version.join('.');
  writeFileSync('./package.json', JSON.stringify(package, null, 2));
}

writeFileSync(
  './build-inject.js',
  `export const buildInfo = ${JSON.stringify({
    date: new Date().toISOString(),
    version: package.version,
  })}; 

  export const process = ${JSON.stringify({ isDev: dev })};
  `
);

esbuild
  .build({
    entryPoints: ['src/index.js'],
    outdir: prod ? 'dist' : 'public/build',
    bundle: true,
    format: 'esm',
    splitting: true,
    inject: ['./build-inject.js'],
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
    plugins: [sveltePlugin()],
  })
  .then(() => {
    if (!dev) return;

    require('serve-http').createServer({
      port: 3000,
      pubdir: require('path').join(__dirname, 'public'),
    });
    console.log('server started at http://localhost:3000');
  });
