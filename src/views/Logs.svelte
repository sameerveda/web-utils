<script>
  import { onMount } from 'svelte';

  import LogAdd from '../components/LogAdd.svelte';
  import LogsView from '../components/LogsView.svelte';
  import { addLog, getLogs, initLogCollection } from '../utils/logs-helper';

  let logs = [];

  onMount(async () => {
    initLogCollection.init || initLogCollection();
    logs = await getLogs();
  });
</script>

<div class="p2">
  <h1 class="mb2">Add Log</h1>
  <LogAdd
    on:addlog={e => {
      logs = [...logs, addLog(e.detail)];
    }}
  />
  <hr />
  <h1>All Logs ({logs.length})</h1>
  <LogsView {logs} />
</div>

<style>
  /* your styles go here */
</style>
