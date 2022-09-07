import 'basscss/css/basscss.css';
import './style.css';
import App from './views/App.svelte';
import lodash from 'lodash';
import mountApp from './utils/mount-app';
import Lodash from './utils-pages/Lodash.svelte';
import MbAssetCompare from './utils-pages/MbAssetCompare.svelte';
import QueryString from './utils-pages/QueryString.svelte';
import env from './utils/env';

if (window._) console.error(`failed to set window._ = lodash;`);
else {
  window._ = lodash;
  console.log('lodash available in console. e.g. _.kebabCase');
}

export const defaultComponents = {
  'Query String': QueryString,
  'MB Asset Compare': MbAssetCompare,
  Lodash,
};

if (env.isDev) {
  defaultComponents.Logs = '/logs.html';
}

App.defaultComponents = defaultComponents;

window.WebUtilsApp = App;
export default App;
mountApp(App, { components: defaultComponents });
