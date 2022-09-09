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
  import { pickBy, uniq, countBy } from 'lodash-es';
  import CopyBtn from '../components/CopyBtn.svelte';
  import StatusList from '../components/StatusList.svelte';

  const cache = JSON.parse(localStorage.getItem('MbAssetCompare') || '{}');
  let liveText = cache.live;
  let currentText = cache.current;

  $: live = split(liveText);
  $: current = split(currentText);

  $: result = (() => {
    if (!live.length || !current.length) return [];

    const duplicates = countDuplicate(current);
    const liveDuplicates = countDuplicate(live);

    return uniq(live.concat(current)).map(url => [
      url,
      liveDuplicates.has(url) && 'live_duplicate',
      duplicates.has(url) && 'duplicate',
      !live.includes(url) && 'new',
      !current.includes(url) && 'missing',
    ]);
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

  <StatusList data={result} />
</div>

<style>
  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>
