<script context="module">
  import { createEventDispatcher, onMount } from 'svelte';
  import Lodash from './utils-pages/Lodash.svelte';
  import MbAssetCompare from './utils-pages/MbAssetCompare.svelte';
  import QueryString from './utils-pages/QueryString.svelte';
  import env from './utils/env';

  export const defaultComponents = {
    'Query String': QueryString,
    'MB Asset Compare': MbAssetCompare,
    Lodash,
  };
</script>

<script>
  export let selected = null;
  export let hashUrl = false;
  export let components = defaultComponents;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (hashUrl && location.hash.substring(1))
      selected = decodeURIComponent(location.hash.substring(1));
  });
</script>

<div class="wu-main-container flex">
  <p title={env.buildTime} class="version-label">{env.version}</p>
  <ul class="p1 m0">
    {#each Object.keys(components) as item}
      <li class:selected={item === selected}>
        <a
          href={hashUrl ? '#' + encodeURIComponent(item) : null}
          on:click={() => {
            selected = item;
            dispatch('selectedChange', item);
          }}
        >
          {item}
        </a>
      </li>
    {/each}
  </ul>
  <div class="wu-content-container flex-auto">
    {#if components[selected]}
      <svelte:component this={components[selected]} />
    {:else}
      {selected ? 'Unknown Util: ' + selected : 'Nothing Selected'}
    {/if}
  </div>
</div>

<style>
  .wu-main-container > ul {
    flex-basis: 200px;
    border-right: 1px solid black;
  }

  .version-label {
    border: thin solid gray;
    position: absolute;
    bottom: 0;
    left: 1px;
    padding: 2px 4px;
    margin: 0;
  }
</style>
