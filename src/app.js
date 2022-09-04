import 'basscss/css/basscss.css';
import './style.css';
import App, { defaultComponents } from './App.svelte';
import lodash from 'lodash';
import env from './utils/env';

if (window._) console.error(`failed to set window._ = lodash;`);
else {
  window._ = lodash;
  console.log('lodash available in console. e.g. _.kebabCase');
}

App.defaultComponents = defaultComponents;

window.WebUtilsApp = App;
export default App;

const target = document.currentScript.getAttribute('target');
target &&
  new App({
    target: document.querySelector(target),
    props: JSON.parse(document.currentScript.getAttribute('props') || '{}'),
  });
