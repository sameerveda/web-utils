<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ObjectToQueryString from './utils/ObjectToQueryString.svelte';
  import ParseQueryString from './utils/ParseQueryString.svelte';

  export let selected = null;
  export let hashUrl = false;
  export let utils = {};

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (hashUrl && location.hash.substring(1))
      selected = decodeURIComponent(location.hash.substring(1));
  });

  const components = {
    ...utils,
    'Query String to Object': ParseQueryString,
    'Object to Query String': ObjectToQueryString,
  };
</script>

<div class="wu-main-container flex">
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
  <div class="wu-content-container flex-auto p2">
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
</style>
