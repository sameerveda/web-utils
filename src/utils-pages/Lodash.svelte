<script>
  import { keys } from 'lodash';
  import Control from '../components/Control.svelte';

  const utils = {};

  let selected;
</script>

<div class="lodash-utils-container">
  <Control let:id text="Utils">
    <select {id} bind:value={selected}>
      {#each Object.keys(utils) as item}
        <option>{item}</option>
      {/each}
    </select>
  </Control>
</div>

<style>
  /* your styles go here */
</style>
