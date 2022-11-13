<script context="module">
  import { debounce, mapValues, size } from 'lodash-es';
  import { parse, stringify, camlizeKeys } from './utils';
  import ResultView from './ResultView.svelte';

  function objectKeysToCamelCase(content) {
    const [result1, error1] = parse(content, camlizeKeys);
    return { error1, result1 };
  }

  function mergeAllowedAttributesDefault(allowedAttributesS, defaultAttributesS) {
    if (!allowedAttributesS?.trim()) return {};
    if (!defaultAttributesS?.trim()) return objectKeysToCamelCase(allowedAttributesS);

    const [allowedAttributes, error1] = parse(allowedAttributesS, camlizeKeys);
    const [defaultAttributes, error2] = parse(defaultAttributesS, camlizeKeys);

    if (error1 || error2) return { error1, error2 };

    return {
      result1: objectKeysToCamelCase(allowedAttributesS),
      result2: mapValues(allowedAttributes, (v, k) => defaultAttributes[k] ?? null),
    };
  }
</script>

<script>
  import CopyBtn from '../CopyBtn.svelte';

  let input1 = null;
  let error1 = null;
  let input2 = null;
  let error2 = null;
  let result1 = null;
  let result2 = null;

  $: code = `static craft = { \nprops: ${
    result2 ? stringify(result2) : '{}'
  }\n} \n\nstatic allowedAttributes = ${result1 ? stringify(result1) : '{}'}`;

  const onChange = debounce(
    () =>
      ({
        result1 = null,
        result2 = null,
        error1 = null,
        error2 = null,
      } = mergeAllowedAttributesDefault(input1, input2)),
    300
  );
</script>

<div class="flex flex-column gap-1 p2">
  <div class="flex gap-1">
    <textarea
      placeholder="allowedAttributes"
      class="flex-auto"
      rows="20"
      bind:value={input1}
      on:input={onChange}
      on:focus={() => (error1 = null)}
    />
    <textarea
      placeholder="defaultAttributes"
      class="flex-auto"
      rows="20"
      bind:value={input2}
      on:input={onChange}
      on:focus={() => (error2 = null)}
    />
  </div>
  <h4 class="m0 p0">RESULT</h4>
  <div class="flex gap-1">
    <ResultView
      title={`allowedAttributes (keys camelcase) (${size(result1)})`}
      content={result1 ? stringify(result1) : null}
    />
    <ResultView
      title={`craft.props (${size(result2)})`}
      content={result2 ? stringify(result2) : null}
    />
  </div>

  <div class="flex">
    <strong>Combined</strong>
    <div class="flex-auto" />
    <CopyBtn content={code} />
  </div>
  <textarea class="w-100" rows="20" value={code} />

  {#if error1}
    <p class="text-red">{error1}</p>
  {/if}
  {#if error2}
    <p class="text-red">{error2}</p>
  {/if}
</div>
