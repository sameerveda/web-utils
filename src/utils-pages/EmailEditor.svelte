<script>
  import { kebabCase, mapValues } from 'lodash-es';
  import MjmlInit from '../components/email-editor/MjmlInit.svelte';
  import MjmlStyleConvert from '../components/email-editor/MjmlStyleConvert.svelte';
  import { localStorageWritable } from '../utils/svelte-utils';

  const actions = {
    'allowedAttributes + defaultAttributes': MjmlInit,
    'mjml attrs': MjmlStyleConvert,
  };

  const open = localStorageWritable(
    'email-editor-$open',
    mapValues(actions, () => true)
  );
</script>

<div class="flex flex-column gap-1 p2">
  {#each Object.entries(actions) as [title, component]}
    <div class="flex flex-column gap-1 border p1" style="border-color: blue">
      <div class="flex">
        <h3 class="m0 p0">{title}</h3>
        <div class="flex-auto" />
        <button on:click={e => ($open = { ...$open, [title]: !$open[title] })}>
          {$open[title] ? 'close' : 'open'}
        </button>
      </div>
      {#if $open[title]}
        <svelte:component this={component} />
      {/if}
    </div>
  {/each}
</div>
