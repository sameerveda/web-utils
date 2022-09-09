<script>
  import { filter } from 'lodash-es';

  import { copyOnClick } from '../utils/svelte-utils';

  export let data;
  export let hideOK;
</script>

<ul class="result" class:hide_ok={hideOK}>
  {#if data?.length}
    <li>
      <input type="checkbox" id="StatusList_hide_ok" bind:checked={hideOK} />
      <label for="StatusList_hide_ok">Hide OK</label>
    </li>
  {/if}

  {#each data as t}
    <li class={t.slice(1).filter(Boolean).join(' ')}>
      <span use:copyOnClick={t[0]}>{t[0]}</span>
      {#each t.slice(1).filter(Boolean) as item}
        <span class={`status-badge ${item}`}>{item}</span>
      {:else}
        <span class={`status-badge ok`}>OK</span>
      {/each}
    </li>
  {/each}
</ul>

<!-- markup (zero or more items) goes here -->
<style>
  .status-badge {
    border: 1px solid black;
    color: white;
    background-color: black;
    padding: 2px 4px;
    font-size: 12px;
    font-family: 'Courier New', Courier, monospace;
  }

  .status-badge.missing,
  .status-badge.removed {
    background-color: red;
  }

  .status-badge.duplicate {
    background-color: crimson;
  }

  .status-badge.live_duplicate {
    background-color: brown;
  }

  .status-badge.new {
    background-color: cyan;
    color: black;
  }

  .status-badge.ok {
    background-color: green;
  }

  .hide_ok .ok {
    display: none;
  }
</style>
