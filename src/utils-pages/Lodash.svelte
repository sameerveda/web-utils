<script context="module">
  // {type}
  const J = 'json';
  const N = 'number';
  const T = 'text';
  const B = 'bool';

  // name_of_{param}
  const NA = 'array';
  const NS = 'size';

  const ARRAY = [NA, J];
  const SIZE = [NS, N];

  function Item(transform, params, result = T) {
    return { transform, params, result };
  }
</script>

<script>
  import { keys, chunk, get } from 'lodash-es';
  import Control from '../components/Control.svelte';

  const utils = {
    Array: {
      chunk: Item(chunk, [ARRAY, SIZE], J),
    },
  };

  let selected;
</script>

<div class="lodash-utils-container flex gap-1 w-100 h-100">
  <ul class="utils-list p1 m0 h-100">
    {#each Object.keys(utils) as group}
      <li>
        <Control let:id text={`${group}(${utils[group].length})`}>
          <select {id} bind:value={selected}>
            {#each Object.keys(utils[group]) as item}
              <option value={`${group}.${item}`}>{item}</option>
            {/each}
          </select>
        </Control>
      </li>
    {/each}
  </ul>
  {#if selected}
    <div class="utils-editor">
      <h4>
        {selected}
        <span>Params</span>
      </h4>
      <form class="params flex flex-wrap gap-1">
        {#each get(utils, selected).params as [name, type], i}
          {@const id = 'param-' + i}
          <fieldset class="flex flex-column gap-1">
            <label for={id}>{name}</label>
            {#if type === J}
              <textarea {name} {id} cols="40" rows="20" />
            {:else if type === N || type === T}
              <input min="1" {type} {name} {id} />
            {:else if type === B}
              <input {name} {id} type="checkbox" />
            {/if}
          </fieldset>
        {/each}
      </form>
    </div>
  {/if}
</div>

<style>
  .utils-list {
    list-style: none;
    border-right: 1px solid gray;
  }

  fieldset {
    height: fit-content;
    border: thin solid lightgray;
  }
</style>
