<script>
  export let text = 'Option Page';
  export let page = null;
  const action = () =>
    page
      ? chrome.tabs.create({ url: chrome.runtime.getURL(page) })
      : chrome.runtime.openOptionsPage();
</script>

<button on:click={action}>{text}</button>
