<script context="module">
  let counter = 1;
</script>

<script>
  export let reversed = false;
  export let id = `control-${counter++}`;
  export let text;
</script>

<span {...$$restProps} class={'flex gap-1 ' + ($$restProps.class || '')} class:reversed>
  <label for={id}>{text}</label>
  <slot prop={id} />
</span>

<style>
  .reversed {
    flex-direction: row-reverse;
  }
</style>
