export function defaultReloadHandler() {
  try {
    chrome.runtime.reload();
  } catch (error) {}

  setTimeout(() => {
    try {
      location.reload();
    } catch (error) {}
  }, 200);
}

/**
 *
 * @param {(e: MessageEvent) => void} handler
 * @param {number} port
 */
export default function enableLivereload(handler = defaultReloadHandler, port = 8570) {
  try {
    const socket = new WebSocket('ws://localhost:' + port);

    socket.addEventListener('open', () => console.log('livereload active'));
    socket.addEventListener('message', handler);
  } catch (error) {
    console.log('failed to enable live reload', error);
  }
}
