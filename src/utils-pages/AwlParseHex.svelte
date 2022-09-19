<script>
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

<div id="AwlParseHex" style="border: 1px solid black; margin: 0.5rem; padding: 0.5rem">
  <label for="AwlParseHex_input" style="display:block">Parse awl legacy select option strings</label>
  <textarea bind:value id="AwlParseHex_input" type="button" rows="2" cols="10" style="width: 90%" />
  {#if error}
    <ul style="color: red">
      {#each error as item}
        <li>item</li>
      {/each}
    </ul>
  {/if}
  {#if result}
    <code use:copyOnClick={result.join('\n')}>{result.join('\n')}</code>
  {/if}
</div>

<style>
  /* your styles go here */
</style>
