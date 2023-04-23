<script>
  let text = '';

  $: output = text?.trim()
    ? Array.from(new Set(Array.from(text.matchAll(/\$(?:\w+-?)+/g), ([s]) => s)))
        .sort()
        .filter(Boolean)
    : [];
  $: output2 = `:root {\n${output
    .map(t => `// --${t.replace('$', '')}: TODO;`)
    .join('\n')}\n}\n\n${output.map(t => `// ${t}: var(--${t.replace('$', '')});`).join('\n')}`;
</script>

<div class="flex flex-column gap-1 w-100 h-100 p2">
  <h3>Input</h3>
  <textarea rows="25" class="w-100" on:input={e => (text = e.target.value)} />
  <h3>Ouput</h3>
  <div class="flex gap-1">
    <textarea rows="25" class="w-100" readonly value={output.join('\n')} />
    <textarea rows="25" class="w-100" readonly value={output2} />
  </div>
</div>

<style>
  /* your styles go here */
</style>
