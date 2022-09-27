<script>
  import { debounce, size } from 'lodash-es';
  import StatusList from '../components/StatusList.svelte';
  import json5 from 'json5';

  let error1 = null;
  let error2 = null;
  let data1 = null;
  let data2 = null;
  let ta1, ta2;

  $: result = ((a, b) => {
    if (!a || !b) return [];
    return Array.from(new Set([...Object.keys(a), ...Object.keys(b)]), k =>
      [
        k,
        a[k] === b[k] && 'ok',
        !a[k] && b[k] && 'new',
        a[k] && !b[k] && 'removed',
        a[k] && b[k] && `${a[k]} -> ${b[k]}`,
      ].filter(Boolean)
    );
  })(data1, data2);

  function parse(value) {
    try {
      return [json5.parse(value), null];
    } catch (e) {
      return [null, String(e)];
    }
  }

  function format(ta, formatJson5) {
    const [data, error] = parse(ta.value);
    if (data)
      ta.value = formatJson5 ? json5.stringify(data, null, 2) : JSON.stringify(data, null, 2);
    return error;
  }
</script>

<div id="CompareJsonObject" class="w-100">
  <span>
    Data 1 ({size(data1)})
    <button on:click={() => (error1 = format(ta1))}>format</button>
    <button on:click={() => (error1 = format(ta1, true))}>format (json5)</button>
  </span>
  <span>
    Data 2 ({size(data2)})
    <button on:click={() => (error2 = format(ta2))}>format</button>
    <button on:click={() => (error1 = format(ta2, true))}>format (json5)</button>
  </span>
  <span>{error1 || ''}</span>
  <span>{error2 || ''}</span>
  <textarea
    bind:this={ta1}
    rows="20"
    on:input={debounce(e => ([data1, error1] = parse(e.target.value)), 500)}
  />
  <textarea
    bind:this={ta2}
    rows="20"
    on:input={debounce(e => ([data2, error2] = parse(e.target.value)), 500)}
  />
</div>

<StatusList data={result} />

<style>
  #CompareJsonObject {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>
