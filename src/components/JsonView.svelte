<script>
  import CopyBtn from './CopyBtn.svelte';
  import Control from './Control.svelte';

  export let data;
  export let minify = false;
  export let readonly = false;
  export let rows = 10;

  $: content = minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);
</script>

<div {...$$restProps} class="json_view flex flex-column mt1 w-100 gap-1">
  <div class="toolbar flex gap-1">
    <Control text="Minify" reversed let:id>
      <input type="checkbox" bind:checked={minify} {id} />
    </Control>

    <CopyBtn {content} />
  </div>
  <textarea class="flex-auto w-100" value={content} {rows} {readonly} />
</div>

<style>
  textarea {
    resize: vertical;
  }
</style>
