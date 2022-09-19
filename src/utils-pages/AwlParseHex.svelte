<script context="module">
  const cache = {};
</script>

<script>
  import CopyBtn from '../components/CopyBtn.svelte';

  let text;
  $: [result, error] = !text?.trim()
    ? ['', null]
    : text
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean)
        .reduce(
          ([result, error], curr) => {
            if (!cache[curr]) {
              const errors = [];

              const t = curr
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

              cache[curr] = [t, errors.join(', ')];
            }

            result.push(cache[curr][0]);
            error.push(cache[curr][1]);

            return [result, error];
          },
          [[], []]
        )
        .map(arr => arr.filter(Boolean));
</script>

<div id="AwlParseHex" class="m1 p1 flex flex-column">
  <label for="AwlParseHex_input" class="d-block">Parse awl legacy select option strings</label>
  <textarea bind:value={text} id="AwlParseHex_input" type="button" rows="10" class="w-100" />
  {#if error}
    <span style="color: red;">errors ({error.length})</span>
    <textarea
      style="color: red"
      value={error.join('\n')}
      rows={Math.min(10, error.length)}
      class="w-100"
    />
  {/if}
  {#if result}
    <span>result ({result.length})</span>
    <textarea value={result.join('\n')} rows={Math.min(result.length, 10)} class="w-100" />
    <CopyBtn content={result.join('\n')} />
  {/if}
</div>

<style>
  /* your styles go here */
</style>
