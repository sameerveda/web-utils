<script context="module">
</script>

<script>
  import { camelCase, debounce, isString } from 'lodash-es';
  import CopyBtn from '../CopyBtn.svelte';
  import { camlizeKeys, parse } from './utils';

  let result = [];
  let error;
  let format = false;
  let type = 's';

  $: varsList = result
    .map(t => (isString(t) ? t : t[1][0] === '"' ? null : t[1]))
    .filter(Boolean)
    .map(s => `${s} = null`).join(', ');

  $: resultString =
    type === 's'
      ? `style={{${result
          .map(t => (Array.isArray(t) ? t.join(':') : t))
          .join(format ? ',\n' : ',')}}}`
      : result
          .map(t => {
            if (isString(t)) return `${t}={${t}}`;
            const [a, b] = t;
            return b[0] === '"' ? `${a}=${b}` : `${a}={${b}}`;
          })
          .join(format ? '\n' : ' ');

  const converter = debounce(e => {
    const text = e.target.value?.trim();
    if (!text) return (result = []);

    const [result1, error1] = parse(
      text.replace(/this\.getAttribute\('.+'\)/g, s => `"${s}"`),
      camlizeKeys
    );
    error = error1;

    if (!result1) return;

    result = Object.entries(result1).map(([k, v]) => {
      let t = /this\.getAttribute\('(.+)'\)/.exec(v)?.[1];
      if (!t) return [k, JSON.stringify(v)];
      else if (k === camelCase(t)) return k;
      else return [k, camelCase(t)];
    });
  }, 300);
</script>

<div class="flex gap-1 flex-column">
  <textarea placeholder="Input" class="w-100" rows="20" on:input={converter} />
  <div class="flex gap-1 items-center">
    <strong>Result ({result.length})</strong>
    <input type="checkbox" id="id_format" bind:checked={format} />
    <label for="id_format">Format</label>
    <div class="flex border gap-1 p1">
      <strong>type</strong>
      <input
        type="radio"
        name="name_type"
        id="id_type_s"
        checked={type === 's'}
        on:change={e => e.target.checked && (type = 's')}
      />
      <label for="id_type_s">Style</label>
      <input
        type="radio"
        name="name_type"
        id="id_type_h"
        checked={type === 'h'}
        on:change={e => e.target.checked && (type = 'h')}
      />
      <label for="id_type_h">html</label>
    </div>
    <div class="flex-auto" />
    <CopyBtn content={resultString} />
  </div>
  {#if error}
    <p class="text-red">{error}</p>
  {/if}
  <div class="flex gap-1">
    <label for="id_keys_list">vars</label>
    <input class="flex-auto" type="text" id="id_keys_list" value={varsList} />
    <CopyBtn content={varsList} />
  </div>
  <textarea placeholder="Result" class="w-100" rows="20" value={resultString} />
</div>
