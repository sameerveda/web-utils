<script>
  import { size } from 'lodash-es';
  import Control from '../components/Control.svelte';
  import CopyBtn from '../components/CopyBtn.svelte';

  let queryString = null,
    url = null,
    queryObject = '{}';

  let error;
  $: result = `${url || ''}?${queryString || ''}`.trim().replace(/\?$/g, '').trim();

  function setURL(e, isQueryString) {
    console.count();
    const text = e.target.value?.trim();
    if (!text?.length) {
      if (isQueryString) {
        queryString = null;
        queryObject = '{}';
      }
      return;
    }

    if (text.includes('?')) {
      [url, queryString] = text.split('?');
      isQueryString = true;
    } else if (isQueryString) {
      queryString = text;
    } else {
      url = text;
    }

    if (isQueryString) {
      queryObject = queryString?.trim()
        ? JSON.stringify(Object.fromEntries(new URLSearchParams(queryString)), null, 2)
        : '{}';
    }
  }
  function setQueryObject(e) {}
</script>

<div class="flex flex-column gap-1">
  <Control let:id text="Query String" class="w-100">
    <input type="text" class="flex-auto" value={queryString} on:input={e => setURL(e, true)} {id} />
  </Control>
  <Control let:id text="URL" class="w-100">
    <input type="text" class="flex-auto" value={url} on:input={setURL} {id} />
  </Control>
  <label for="wu_query_object">Query Object ({size(JSON.parse(queryObject))})</label>
  <textarea
    id="wu_query_object"
    class="w-100"
    rows="20"
    value={queryObject}
    on:change={setQueryObject}
  />
  <span>
    Result: <code>{result}</code>
    <CopyBtn content={result} />
  </span>
  <p class="error">{error || ''}</p>
</div>

<style>
  .error {
    color: red;
  }

  textarea {
    resize: vertical;
  }
</style>
