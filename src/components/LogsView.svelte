<script>
  export let logs;
</script>

<ul>
  {#each logs as item}
    <li>{JSON.stringify(item)}</li>
  {/each}
</ul>

<style>
  /* your styles go here */
</style>
