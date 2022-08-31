<script>
  import JsonView from './JsonView.svelte';
  import Labeled from './Labeled.svelte';

  let params;
  $: parsed = params?.trim().replace(/^\?/, '').trim()
    ? Object.fromEntries(new URLSearchParams(params.trim()))
    : {};
</script>

<Labeled let:id text="Enter Query String" class="w-100" >
  <input type="text" class="flex-auto" bind:value={params} {id} />
</Labeled>
<JsonView data={parsed} readonly="true" />

<style>
</style>
