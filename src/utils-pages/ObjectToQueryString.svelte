<script>
  import CopyBtn from '../components/CopyBtn.svelte';

  let value = '{}';
  let params;
  let error;

  $: {
    try {
      params = value?.trim()
        ? new URLSearchParams(Object.entries(JSON.parse(value))).toString()
        : '';
      error = null;
    } catch (e) {
      error = String(e);
    }
  }
</script>

<div class="flex flex-column gap-1">
  <span>
    Query Object <button on:click={() => (value = JSON.stringify({ a: 10, b: 20 }, null, 2))}>
      Example
    </button>
  </span>
  <textarea bind:value rows="10" />
  <button
    on:click={() => {
      value = '{}';
      params = null;
      error = null;
    }}
  >
    clear
  </button>
  <span>Generated Query String <CopyBtn content={params} /></span>
  <code>{params || ''}</code>
  <p class="error">{error || ''}</p>
</div>

<style>
  .error {
    color: red;
  }

  textarea {
    resize: vertical;
  }
</style>
