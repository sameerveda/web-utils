<script>
  export let content;

  async function copy(e) {
    try {
      e.target.textContent = 'Copying';
      await navigator.clipboard.writeText(content);
      e.target.textContent = 'Copied';
      setTimeout(() => (e.target.textContent = 'Copy'), 1000);
    } catch (error) {
      console.error(error);
      e.target.textContent = 'Failed to copy';
      setTimeout(() => (e.target.textContent = 'Copy'), 1500);
    }
  }
</script>

<button disabled={!content} on:click={copy}>Copy</button>

<style>
  /* your styles go here */
</style>
