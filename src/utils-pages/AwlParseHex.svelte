<script>
  import CopyBtn from '../components/CopyBtn.svelte';
  import { copyOnClick } from '../utils/svelte-utils.js';

  let value;
  $: [result, error] = !value?.trim()
    ? ['', null]
    : value
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(s =>
          s
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        )
        .reduce(
          ([result, error], curr) => {
            const t = curr
              .flatMap(s => {
                if (s.length === 6 && s.startsWith('0x')) {
                  return [s.substring(4), s.substring(2, 4)];
                } else error.push(s);
              })
              .filter(s => s != null)
              .map(s => String.fromCharCode(parseInt(s, 16)))
              .join('');

            result.push(t);
            return [result, error];
          },
          [[], []]
        );
</script>

<div id="AwlParseHex" class="m1 p1 flex flex-column">
  <label for="AwlParseHex_input" class="d-block">Parse awl legacy select option strings</label>
  <textarea bind:value id="AwlParseHex_input" type="button" rows="2" class="w-100" />
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
    <textarea value={result.join('\n')} rows={result.length} class="w-100" />
    <CopyBtn content={result.join('\n')} />
  {/if}
</div>

<style>
  /* your styles go here */
</style>
