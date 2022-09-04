<script>
  export let text;
  export let pageName;
  const action = () => pageName && chrome.tabs.create({ url: chrome.runtime.getURL(pageName) });
</script>

<button on:click={action}>
  {text || 'ERROR: BTN TEXT NOT SPECIFIED '}{pageName ? '' : 'ERROR: pageName not specified'}
</button>
