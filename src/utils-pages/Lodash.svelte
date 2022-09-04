<script context="module">
  // {type}
  const JSON = 'json';
  const NUMBER = 'number';
  const TEXT = 'text';
  const BOOL = 'bool';

  const ARRAY = ['array', JSON];
  const SIZE = ['size', NUMBER];
  const FIELD = ['field', TEXT];

  function Item(transform, params, result = TEXT) {
    return { transform, params, result };
  }

  const utils = {
    Array: {
      chunk: Item(chunk, [ARRAY, SIZE], JSON),
      difference: Item(difference, [ARRAY, ARRAY], JSON),
      differenceBy: Item(differenceBy, [ARRAY, ARRAY, FIELD], JSON),
    },
  };

  const valueGetters = {
    [JSON]: t => window.JSON.parse(t.value),
    [NUMBER]: t => (isNumber(+t.value) ? +t.value : undefined),
    [TEXT]: t => t.value,
    [BOOL]: t => t.checked,
  };
</script>

<script>
  import { chunk, difference, differenceBy, get, isNumber, size } from 'lodash-es';
  import Control from '../components/Control.svelte';
  import CopyBtn from '../components/CopyBtn.svelte';

  let selected;
  let result = null;
  let form;
  let error;
  let live = false;

  $: selectedItem = selected && get(utils, selected);

  $: if (selected) {
    result = null;
  }

  function apply() {
    try {
      result = selectedItem.transform.apply(
        null,
        selectedItem.params.map(([name, type]) => valueGetters[type](form[name]))
      );
      if (selectedItem.result === JSON) result = window.JSON.stringify(result);
    } catch (e) {
      console.error(e);
      error = String(e);
    }
  }
  function format(text, indent) {
    error = null;
    try {
      return text?.trim() ? window.JSON.stringify(window.JSON.parse(text), null, indent) : text;
    } catch (e) {
      console.error(e);
      error = String(e);
    }

    return text;
  }
</script>

<div class="lodash-utils-container flex gap-1 w-100 h-100">
  <ul class="utils-list p1 m0 h-100">
    {#each Object.keys(utils) as group}
      <li>
        <Control let:id text={`${group}(${size(utils[group])})`}>
          <select {id} bind:value={selected}>
            {#each Object.keys(utils[group]) as item}
              <option value={`${group}.${item}`}>{item}</option>
            {/each}
          </select>
        </Control>
      </li>
    {/each}
  </ul>
  {#if selectedItem}
    <div class="utils-editor">
      <h4>
        {selected}
        <span>Params</span>
      </h4>
      <form
        bind:this={form}
        class="params flex flex-wrap gap-1"
        on:submit={e => (e.preventDefault(), apply())}
        on:change={console.log}
      >
        {#each selectedItem.params as [name, type], i}
          {@const id = 'param-' + i}
          <div class="flex flex-column gap-1  border control-wrapper">
            <label for={id} class="flex gap-1 px1 pt1">
              {name}
              <div class="flex-auto" />
              {#if type === JSON}
                <button on:click={() => (form[name].value = format(form[name].value))}>
                  Minify
                </button>
                <button on:click={() => (form[name].value = format(form[name].value, 2))}>
                  Format
                </button>
              {/if}
            </label>
            {#if type === JSON}
              <textarea {name} {id} cols="40" rows="20" />
            {:else if type === NUMBER || type === TEXT}
              <input min="1" {type} {name} {id} />
            {:else if type === BOOL}
              <input {name} {id} type="checkbox" />
            {/if}
          </div>
        {/each}
      </form>
      <div class="mt2 flex justify-end items-center gap-1">
        <input type="checkbox" bind:checked={live} id="live-toggle" />
        <label for="live-toggle">Live Apply</label>
        <button style="font-size: 20px" on:click={apply}>Apply</button>
      </div>
      <hr />
      <div class="flex gap-1 mb1">
        Result ({size(result)})
        <div class="flex-auto" />
        <CopyBtn content={result} />
        {#if selectedItem.result === JSON && result}
          <button on:click={() => (result = format(result))}>Minify</button>
          <button on:click={() => (result = format(result, 2))}>Format</button>
        {/if}
      </div>
      {#if error}
        <p style="color: red">{error}</p>
      {/if}

      <textarea value={result} class="w-100" rows="20" />
    </div>
  {/if}
</div>

<style>
  .utils-list {
    list-style: none;
    border-right: 1px solid gray;
  }

  .border {
    border: thin solid lightgray;
  }
  .control-wrapper {
    height: fit-content;
    padding-bottom: 0.25rem;
  }
</style>
