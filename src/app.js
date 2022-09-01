import 'basscss/css/basscss.css';
import './style.css';
import App, { defaultComponents } from './App.svelte';
import lodash from 'lodash';

if (window._) console.error(`failed to set window._ = lodash;`);
else {
  window._ = lodash;
  console.log('lodash available in console. e.g. _.kebabCase');
}

App.defaultComponents = defaultComponents;
export default App;