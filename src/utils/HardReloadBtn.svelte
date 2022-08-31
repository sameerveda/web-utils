<script>
  export let text = 'hard reset';
  const action = () => chrome.runtime.reload();
</script>

<button on:click={action}>{text}</button>
