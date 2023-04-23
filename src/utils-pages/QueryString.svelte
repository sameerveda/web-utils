<script>
  import QueryString2 from './QueryString2.svelte';

  let n = 1;
</script>

<button on:click={() => n++}>new</button>
<div class={'qs-items w-100 items-' + n}>
  {#each Array.from({ length: n }) as item}
    <QueryString2 />
  {/each}
</div>

<style>
  .qs-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .qs-items.items-1 {
    display: block;
  }
</style>
