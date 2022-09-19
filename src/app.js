import 'basscss/css/basscss.css';
import './style.css';
import App from './views/App.svelte';
import lodash from 'lodash';
import mountApp from './utils/mount-app';
import Lodash from './utils-pages/Lodash.svelte';
import MbAssetCompare from './utils-pages/MbAssetCompare.svelte';
import QueryString from './utils-pages/QueryString.svelte';
import CompareJsonObject from './utils-pages/CompareJsonObject.svelte';
import Skidrow from './utils-pages/Skidrow.svelte';
import AwlParseHex from './utils-pages/AwlParseHex.svelte';
import Logs from './views/Logs.svelte';

if (window._) console.error(`failed to set window._ = lodash;`);
else {
  window._ = lodash;
  console.log('lodash available in console. e.g. _.kebabCase');
}

export const defaultComponents = {
  'Query String': QueryString,
  'MB Asset Compare': MbAssetCompare,
  Lodash,
  Logs,
  CompareJsonObject,
  Skidrow,
  AwlParseHex
};

App.defaultComponents = defaultComponents;

window.WebUtilsApp = App;
export default App;
mountApp(App, { components: defaultComponents });
