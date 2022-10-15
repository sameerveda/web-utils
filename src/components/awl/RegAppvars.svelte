<script>
  import { debounce } from 'lodash-es';

  let text = '';
  let prefix = 'keys.';
  let suffix = ',';
  $: result0 = text?.trim() ? Array.from(text.matchAll(/\.appvars\.(\w+)/g), c => c[1]) : [];
  $: result =
    result0.length && (prefix || suffix) ? result0.map(s => `${prefix}${s}${suffix}`) : result0;
</script>

<div class="flex flex-column gap-1 p2">
  <p><code>RESULT = TEXT.matchAll(/\.appvars\.(\w+)/g), c => c[1]).join('\n')</code></p>
  <label for="RA_TEXT">TEXT</label>
  <textarea
    id="RA_TEXT"
    class="w-100"
    rows="10"
    value={text}
    on:input={debounce(e => (text = e.target.value), 500)}
  />
  <div>
    <label for="RA_RESULT">RESULT ({result.length})</label>
    |
    <label for="RA_PREFIX">Prefix</label>
    <input
      type="text"
      id="RA_PREFIX"
      on:input={debounce(e => (prefix = e.target.value), 500)}
      value={prefix}
    />
    |
    <label for="RA_Suffix">Suffix</label>
    <input
      type="text"
      id="RA_Suffix"
      on:input={debounce(e => (suffix = e.target.value), 500)}
      value={suffix}
    />
  </div>
  <textarea id="RA_RESULT" class="w-100" rows="10" value={result.join('\n')} />
</div>

<style>
  /* your styles go here */
</style>
