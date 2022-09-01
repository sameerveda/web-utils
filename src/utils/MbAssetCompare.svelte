<script context="module">
  function split(text, type) {
    return (
      text
        ?.trim()
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean) || []
    );
  }

  function countDuplicate(list) {
    return new Set(Object.keys(pickBy(countBy(list), t => t > 1)));
  }
</script>

<script>
  import { pickBy, uniq, countBy } from 'lodash';
  const cache = JSON.parse(localStorage.getItem('MbAssetCompare') || '{}');
  let liveText = cache.live;
  let currentText = cache.current;

  $: live = split(liveText);
  $: current = split(currentText);

  $: result = (() => {
    if (!live.length || !current.length) return [];

    const duplicates = countDuplicate(current);
    const liveDuplicates = countDuplicate(live);

    return uniq(live.concat(current)).map(url => ({
      url,
      status: Object.entries({
        live_duplicate: liveDuplicates.has(url),
        duplicate: duplicates.has(url),
        new: !live.includes(url),
        missing: !current.includes(url),
      })
        .filter(([k, v]) => v)
        .map(([k]) => k),
    }));
  })();

  $: localStorage.setItem(
    'MbAssetCompare',
    JSON.stringify({ live: liveText, current: currentText })
  );
</script>

<div class="h-100 overflow-auto">
  <div class="input-container w-100">
    <span class="flex">
      Live ({live.length})
      <div class="flex-auto" />
      <button
        on:click={() => {
          [liveText, currentText] = [currentText, liveText];
        }}
      >
        Flip Content
      </button>
    </span>
    <span>Current ({current.length})</span>
    <textarea rows="30" bind:value={liveText} />
    <textarea rows="30" bind:value={currentText} />
  </div>

  <ul>
    {#each result as item}
      <li class="mb1">
        {item.url}
        {#each item.status as item}
          <span class={`status-badge ${item}`}>{item}</span>
        {:else}
          <span class={`status-badge ok`}>OK</span>
        {/each}
      </li>
    {/each}
  </ul>
</div>

<style>
  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .status-badge {
    border: 1px solid black;
    color: white;
    padding: 2px 4px;
    font-size: 12px;
    font-family: 'Courier New', Courier, monospace;
  }

  .missing {
    background-color: red;
  }

  .duplicate {
    background-color: crimson;
  }

  .live_duplicate {
    background-color: brown;
  }

  .new {
    background-color: cyan;
    color: black;
  }

  .ok {
    background-color: green;
  }
</style>
