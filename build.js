const sveltePlugin = require('esbuild-svelte');
const esbuild = require('esbuild');
const dev = process.argv.includes('--dev');

esbuild
  .build({
    entryPoints: ['src/index.js'],
    outdir: 'public/build',
    bundle: true,
    format: 'esm',
    splitting: true,
    loader: {
      '.html': 'text',
      '.png': 'dataurl',
      '.woff': 'file',
      '.woff2': 'file',
      '.eot': 'file',
      '.ttf': 'file',
      '.svg': 'file',
    },
    minify: dev,
    watch: true,
    plugins: [sveltePlugin()],
  })
  .then(() => {
    require('serve-http').createServer({
      port: 3000,
      pubdir: require('path').join(__dirname, 'public'),
    });
    console.log('server started at http://localhost:3000');
  });
