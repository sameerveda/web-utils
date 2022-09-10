<script>
  import { localStorageWritable } from '../utils/svelte-utils';

  let lines = localStorageWritable('Skidrow', []);
  let selected = null;
  let open = false;
  let ta;

  $: selectedIndex = $lines.indexOf(selected);
  $: content$ = selected ? fetch(selected).then(t => t.text()) : Promise.resolve(null);
</script>

{#if open}
  <dialog open>
    <p>Insert Urls here</p>
    <textarea bind:this={ta} class="w-100" rows="30" />
    <div class="flex align-center justify-end">
      <button
        on:click={() => {
          $lines =
            ta.value
              ?.split(/\r?\n/g)
              .map(s => s.trim())
              .filter(Boolean) || [];
          open = false;
        }}
      >
        OK
      </button>
    </div>
  </dialog>
{/if}

<div id="Skidrow" class="flex gap-1 w-100 h-100">
  <ul class="url-list" on:click={e => e.target.dataset.item && (selected = e.target.dataset.item)}>
    <li class="flex gap-1">
      Urls ({$lines.length})
      <button on:click={() => (open = true)}>Load</button>
      <div class="flex-auto" />
      <button on:click={() => (selected = $lines[Math.max(selectedIndex - 1, 0)])}>Prev</button>
      <button on:click={() => (selected = $lines[(selectedIndex + 1) % $lines.length])}>
        Next
      </button>
    </li>
    {#each $lines as item}
      <li data-item={item} class:selected={selected === item}>{new URL(item).pathname}</li>
    {/each}
  </ul>
  <div class="flex-auto">
    {#if selected}
      <p>url: ({selectedIndex}/{$lines.length}) {selected}</p>
      <hr />
      {#await content$}
        <h1>LOADING</h1>
      {:then data}
        {#if data}
          <!-- content here -->
        {:else}
          <p>Nothing Selected</p>
        {/if}
      {:catch error}
        <p>Failed to load: {String(error)}</p>
      {/await}
    {/if}
  </div>
</div>

<style lang="scss">
  dialog {
    width: 500px;
    top: 50%;
    left: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
  }

  .url-list {
    max-height: 100%;
    overflow: auto;
    width: 400px;
    list-style: none;
    padding: 0;
    margin: 0;
    padding-bottom: 1rem;
  }

  .url-list li {
    padding: 0.25rem;
    cursor: pointer;

    &:nth-child(even) {
      background: lightyellow;
    }

    &.selected {
      background: blue;
      color: white;
    }
  }
</style>
