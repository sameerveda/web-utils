<script context="module">
  const withZero = t => (t < 10 ? `0${t}` : t);
  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}-${withZero(d.getMonth() + 1)}-${withZero(d.getDate())}T${withZero(
      d.getHours()
    )}:${withZero(d.getMinutes())}`;
  };
</script>

<script>
  import { createEventDispatcher } from 'svelte';

  let date = now();
  let title = null;
  let content = null;

  const dispatch = createEventDispatcher();

  function clear() {
    date = now();
    title = null;
    content = null;
  }

  function add(e) {
    if (!title && !content) return;
    if (e instanceof KeyboardEvent && e.code !== 'Enter') return;
    if (e.target.tagName === 'TEXTAREA' && !e.ctrlKey) return;

    dispatch('addlog', { title, content, date });
    clear();
  }
</script>

<div>
  <div class="flex gap-1 items-center mb2">
    <label for="wu-note-title">Title</label>
    <input
      id="wu-note-title"
      bind:value={title}
      class="flex-auto"
      type="text"
      name="title"
      on:keyup={add}
    />
    <label for="wu-note-date">Date</label>
    <input id="wu-note-date" type="datetime-local" name="date" bind:value={date} />
    <button on:click={() => (date = now())}>now</button>
  </div>
  <textarea name="content" class="w-100" rows="5" bind:value={content} on:keyup={add} />
  <div class="flex align-center justify-end gap-1">
    <button class="wu-action-btn" on:click={clear}>Clear</button>
    <button class="wu-action-btn" disabled={!title && !content} on:click={add}>Add</button>
  </div>
</div>

<style>
  #wu-note-title {
    font-size: 1rem;
    height: 32px;
  }

  .wu-action-btn {
    font-size: 1.5rem;
    width: 7rem;
  }
</style>
