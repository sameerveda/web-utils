<script>
  import CopyBtn from '../CopyBtn.svelte';

  export let content;
  export let title;
</script>

<div class="flex-auto flex flex-column gap-1 ">
  <div class="flex">
    <strong>{title}</strong>
    <div class="flex-auto" />
    <CopyBtn {content} />
  </div>
  <textarea class="w-100" rows="20" value={content} />
</div>
