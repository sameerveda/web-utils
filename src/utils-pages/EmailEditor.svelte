<script context="module">
  import json5 from 'json5';
  import { camelCase, debounce, mapKeys, mapValues } from 'lodash-es';
  import { onMount } from 'svelte';

  const camlize = json => mapKeys(json, (_, k) => camelCase(k));
  function parse(content, transform) {
    try {
      return [transform ? transform(json5.parse(content)) : json5.parse(content)];
    } catch (error) {
      return [null, String(error)];
    }
  }

  const stringify = s => json5.stringify(s, null, 2);

  function objectKeysToCamelCase(content) {
    const [result, error1] = parse(content, camlize);
    return { error1, result };
  }

  function mergeAllowedAttributesDefault(allowedAttributesS, defaultAttributesS) {
    const [allowedAttributes, error1] = parse(allowedAttributesS, camlize);
    const [defaultAttributes, error2] = parse(defaultAttributesS, camlize);

    if (error1 || error2) return { error1, error2 };

    return {
      result: mapValues(allowedAttributes, (v, k) => defaultAttributes[k] ?? null),
    };
  }
</script>

<script>
  import CopyBtn from '../components/CopyBtn.svelte';

  let input1 = null;
  let error1 = null;
  let input2 = null;
  let error2 = null;
  let result = null;
  let liveConvert = false;

  const actions = {
    'Object Keys To camelCase': {
      action: objectKeysToCamelCase,
      liveConvert: true,
    },
    'allowedAttributes + defaultAttributes': {
      action: mergeAllowedAttributesDefault,
      placeholder: ['allowedAttributes', 'defaultAttributes'],
      dual: true,
    },
  };

  let selectedTitle;
  $: selected = actions[selectedTitle];

  function select(e, title) {
    selectedTitle = title || e.target.value;
    result = null;
    liveConvert = actions[selectedTitle].liveConvert || false;
  }

  select(null, Object.keys(actions)[0]);

  function callAction() {
    if (!input1?.trim() || (selected.dual && !input2?.trim())) {
      result = null;
      error1 = null;
      error2 = null;
      return;
    }

    ({ result, error1 = null, error2 = null } = (selected.action || selected)(input1, input2));
  }

  const liveCallAction = debounce(callAction, 300);
</script>

<div class="flex flex-column gap-1 p2">
  <div class="flex gap-1">
    <select value={selectedTitle} on:change={select}>
      {#each Object.keys(actions) as item}
        <option>{item}</option>
      {/each}
    </select>
    <input type="checkbox" id="live_convert" bind:checked={liveConvert} />
    <label for="live_convert">live convert</label>
    <div class="flex-auto" />
    <button disabled={!input1} on:click={callAction}>convert</button>
  </div>
  <div class="flex gap-1">
    <textarea
      placeholder={Array.isArray(selected.placeholder)
        ? selected.placeholder[0]
        : selected.placeholder || 'Input 1'}
      class="flex-auto"
      rows="20"
      bind:value={input1}
      on:input={liveConvert && liveCallAction()}
      on:focus={() => (error1 = null)}
    />
    {#if selected.dual}
      <textarea
        placeholder={selected.placeholder[1] || 'Input 2'}
        class="flex-auto"
        rows="20"
        bind:value={input2}
        on:input={liveConvert && liveCallAction()}
        on:focus={() => (error2 = null)}
      />
    {/if}
  </div>
  {#if result}
    {@const resultS = stringify(result)}
    <div class="flex">
      <strong>{selectedTitle}</strong>
      <div class="flex-auto" />
      <CopyBtn content={resultS} />
    </div>
    <textarea class="w-100" rows="20" value={resultS} />
  {/if}
  {#if error1}
    <p class="text-red">{error1}</p>
  {/if}
  {#if error2}
    <p class="text-red">{error2}</p>
  {/if}
</div>
