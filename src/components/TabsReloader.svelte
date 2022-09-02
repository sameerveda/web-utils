<script>
  import chrome from '../utils/chrome';

  export let tabs;
  let checked = {};

  // clear checked on tabs change
  if (tabs || true) {
    checked = {};
  }
</script>

<ul>
  <span>
    <input
      type="checkbox"
      on:change={e => (checked = Object.fromEntries(tabs.map(t => [t.id, e.target.checked])))}
    />
    <label for="TabsReloader_select-all" />
    <button
      on:click={() => Object.entries(checked).forEach(([k, v]) => v && chrome.tabs.reload(+k))}
    >
      Reload Selected
    </button>
  </span>
  {#each tabs as tab}
    <li title={tab.url}>
      <input type="checkbox" bind:checked={checked[tab.id]} />
      {tab.title || ''}
      <small>({tab.url})</small>
      <button on:click={() => chrome.tabs.reload(tab.id)}>Reload</button>
    </li>
  {:else}
    No Tabs
  {/each}
</ul>

<style>
  li {
    list-style: decimal;
    margin-bottom: 0.25rem;
  }
</style>
