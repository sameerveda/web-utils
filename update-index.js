const fs = require('fs');

const content = fs
  .readdirSync('./src/components')
  .filter(s => s.endsWith('.svelte'))
  .map(s => s.replace('.svelte', ''))
  .map(s => `export {default as ${s}} from './components/${s}.svelte';`)
  .join('\n');

fs.writeFileSync('./src/index.js', content);
