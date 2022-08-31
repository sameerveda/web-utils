<script>
  export let text = 'Option Page';
  const action = () => chrome.runtime.openOptionsPage();
</script>

<button on:click={action}>{text}</button>
