import 'basscss/css/basscss.css';
import './style.css';
export { default as App } from './App.svelte';
export { default as CopyBtn } from './utils/CopyBtn.svelte';
export { default as JsonView } from './utils/JsonView.svelte';
export { default as Labeled } from './utils/Labeled.svelte';

export const buildInfo = process.buildInfo;
