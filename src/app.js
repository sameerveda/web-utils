import 'basscss/css/basscss.css';
import './style.css';
import App from './views/App.svelte';
import lodash from 'lodash';
import mountApp from './utils/mount-app';
import Lodash from './utils-pages/Lodash.svelte';
import MbAssetCompare from './utils-pages/MbAssetCompare.svelte';
import QueryString from './utils-pages/QueryString.svelte';
import CompareJsonObject from './utils-pages/CompareJsonObject.svelte';
import Awl from './utils-pages/Awl.svelte';
import EmailEditor from './utils-pages/EmailEditor.svelte';
import Logs from './views/Logs.svelte';
import ExtractScssVars from './utils-pages/ExtractScssVars.svelte';
import env from './utils/env';

if (window._) console.error(`failed to set window._ = lodash;`);
else {
  window._ = lodash;
  console.log('lodash available in console. e.g. _.kebabCase');
}

console.log('env', env);

export const defaultComponents = {
  'Query String': QueryString,
  'MB Asset Compare': MbAssetCompare,
  Lodash,
  Logs,
  CompareJsonObject,
  Awl,
  EmailEditor,
  ExtractScssVars
};

App.defaultComponents = defaultComponents;

window.WebUtilsApp = App;
export default App;
mountApp(App, { components: defaultComponents });
