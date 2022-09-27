<script context="module">
  import { join, memoize } from 'lodash-es';
  import { text } from 'svelte/internal';

  const parseLine = memoize(line => {
    const errors = [];
    const t = line
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .flatMap(s => {
        if (s.length === 6 && s.startsWith('0x')) {
          return [s.substring(4), s.substring(2, 4)];
        } else errors.push(s);
      })
      .filter(s => s != null)
      .map(s => String.fromCharCode(parseInt(s, 16)))
      .join('');

    return [t, errors.join(', ')];
  });

  function parse(text) {
    return text
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
      .reduce(
        (acc, curr) => {
          const [result, error] = parseLine(curr);
          acc[0].push(result);
          acc[1].push(error);
          return acc;
        },
        [[], []]
      )
      .map(arr => arr.filter(Boolean));
  }
</script>

<script>
  let resultText, error;
  $: resultTextArray = resultText?.split(/\r?\n/) || [];
</script>

<div id="AwlParseHex" class="m1 p1 flex flex-column">
  <label for="AwlParseHex_input" class="d-block">Parse awl legacy select option strings</label>
  <textarea
    on:input={e => {
      if (!e.target.value?.trim()) {
        resultText = null;
        error = null;
      } else {
        const result = parse(e.target.value);
        resultText = result[0]?.join('\n');
        error = result[1];
      }
    }}
    id="AwlParseHex_input"
    type="button"
    rows="10"
    class="w-100"
  />
  {#if error}
    <span style="color: red;">errors ({error.length})</span>
    <textarea
      style="color: red"
      value={error.join('\n')}
      rows={Math.min(10, error.length)}
      class="w-100"
    />
  {/if}
  {#if resultText}
    <span>result ({resultTextArray.length})</span>
    <textarea
      value={resultText}
      on:input={e => (resultText = e.target.value)}
      rows={Math.min(resultTextArray.length, 10)}
      class="w-100"
    />
    <span>JSON</span>
    <textarea
      readonly
      value={JSON.stringify(resultTextArray)}
      rows={Math.min(resultTextArray.length, 10)}
      class="w-100"
    />
    <span>Options</span>
    <textarea
      value={resultTextArray.map(s => `<option>${s}</option>`).join('\n')}
      rows={Math.min(resultTextArray.length, 10)}
      class="w-100"
    />
  {/if}
</div>

<style>
  /* your styles go here */
</style>
