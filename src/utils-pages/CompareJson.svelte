<script>
  import { debounce, size } from 'lodash-es';
  import StatusList from '../components/StatusList.svelte';

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
      return [JSON.parse(value), null];
    } catch (e) {
      return [JSON.parse(value), null];
    }
  }

  function format(ta) {
    const [data, error] = parse(ta.value);
    if (data) ta.value = JSON.stringify(data, null, 2);
  }
</script>

<div id="CompareJson" class="w-100">
  <span>
    Data 1 ({size(data1)})
    <button on:click={() => format(ta1)}>format</button>
  </span>
  <span>
    Data 2 ({size(data2)})
    <button on:click={() => format(ta2)}>format</button>
  </span>
  <span>{error1 || ''}</span>
  <span>{error2 || ''}</span>
  <textarea
    bind:this={ta1}
    rows="20"
    on:input={debounce(e => ([data1, error1] = parse(e.target.value)), 500)}
  />
  <textarea
    bind:this={ta1}
    rows="20"
    on:input={debounce(e => ([data2, error2] = parse(e.target.value)), 500)}
  />
</div>

<StatusList data={result} />

<style>
  #CompareJson {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>
