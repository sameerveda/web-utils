<script>
  import AwlParseHex from '../components/awl/ParseHex.svelte';
  import RegAppvars from '../components/awl/RegAppvars.svelte';
  import { localStorageWritable } from '../utils/svelte-utils';

  const components = { AwlParseHex, RegAppvars };
  const selected = localStorageWritable('awl-$selected', null);
</script>

<div class="wu-content-container flex-auto">
  <div>
    <select bind:value={$selected}>
      {#each Object.keys(components) as item}
        <option>{item}</option>
      {/each}
    </select>
    <h1>{$selected}</h1>
  </div>
  {#if components[$selected]}
    <svelte:component this={components[$selected]} />
  {:else}
    {$selected ? 'Unknown Util: ' + $selected : 'Nothing selected'}
  {/if}
</div>

<style>
  /* your styles go here */
</style>
