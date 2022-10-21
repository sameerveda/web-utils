import { logger } from './logger';
import { getCurrentTab } from './utils';

const EVENT_TO_CONTENT_SCRIPT = 'EVENT_TO_CONTENT_SCRIPT';
const EVENT_FROM_CONTENT_SCRIPT = 'EVENT_FROM_CONTENT_SCRIPT';

/**
 * when registerContentScriptRequestHandlers handler REDIRECT_SEND_MESSAGE_ASYNC, it will process the event with sendMessageAsync
 */
export const REDIRECT_SEND_MESSAGE_ASYNC = 'REDIRECT_SEND_MESSAGE_ASYNC';

export async function sendTabMsg(msg, responseCallback) {
  const currentTab = await getCurrentTab();
  chrome.tabs.sendMessage(currentTab.id, msg, responseCallback);
}

export function sendMessage(msg, callback) {
  logger.debug('send msg: ', msg);
  chrome.runtime.sendMessage(msg, callback);
}

export async function sendMessageAsync(msg) {
  logger.debug('send msg(async): ', msg);

  return new Promise((res, rej) => {
    try {
      chrome.runtime.sendMessage(msg, res);
    } catch (error) {
      rej(error);
    }
  });
}

export function dispatch(eventName, detail) {
  logger.debug('dispatch: ', detail);
  document.dispatchEvent(
    new CustomEvent(eventName, {
      detail,
      bubbles: true,
    })
  );
}

export async function sendToContentScript(type, data) {
  return new Promise((res, rej) => {
    const time = Date.now();
    let timeout = null;
    const handler = e => {
      if (e.detail?.detail?.time === time) {
        clearTimeout(timeout);
        e.detail.error ? rej(e.detail.error) : res(e.detail.data);
        logger.debug(EVENT_FROM_CONTENT_SCRIPT, e.detail);
        document.removeEventListener(EVENT_FROM_CONTENT_SCRIPT, handler);
      }
    };

    document.addEventListener(EVENT_FROM_CONTENT_SCRIPT, handler);
    dispatch(EVENT_TO_CONTENT_SCRIPT, {
      type,
      time,
      data,
    });

    timeout = setTimeout(() => {
      logger.error('no response for', JSON.stringify({ type, data }));
      rej('no response for' + JSON.stringify({ type, data }));
      document.removeEventListener(EVENT_FROM_CONTENT_SCRIPT, handler);
    }, 3000);
  });
}

const symbol_initialized = Symbol('initialized');
const symbol_allHandlers = Symbol('allHandlers');

function getInitHandlersPair(func) {
  const initialized = func[symbol_initialized];
  func[symbol_initialized] = true;

  const allHandlers = func[symbol_allHandlers] || {};
  func[symbol_allHandlers] = allHandlers;

  return [initialized, allHandlers];
}

export function registerContentScriptRequestHandlers(handlers) {
  const [initialized, allHandlers] = getInitHandlersPair(registerContentScriptRequestHandlers);

  if (Object.keys(handlers).some(k => k in allHandlers))
    throw new Error('handlers conflict: ' + Object.keys(handlers).filter(k => k in allHandlers));

  Object.assign(allHandlers, handlers);
  logger.debug('registerContentScriptRequestHandlers', handlers);
  if (initialized) return;

  document.addEventListener(EVENT_TO_CONTENT_SCRIPT, async (/** @type {CustomEvent} */ e) => {
    logger.debug(EVENT_TO_CONTENT_SCRIPT, e.detail);
    const { type, data } = e.detail;
    const handler =
      allHandlers[type] === REDIRECT_SEND_MESSAGE_ASYNC
        ? data => sendMessageAsync({ type, data })
        : allHandlers[type];

    if (!handler) return;

    try {
      dispatch(EVENT_FROM_CONTENT_SCRIPT, { detail: e.detail, data: await handler(data) });
    } catch (error) {
      dispatch(EVENT_FROM_CONTENT_SCRIPT, { detail: e.detail, error: String(error) });
    }
  });
}

export function registerMsgRequestHandlers(handlers) {
  const [initialized, allHandlers] = getInitHandlersPair(registerMsgRequestHandlers);

  if (Object.keys(handlers).some(k => k in allHandlers))
    throw new Error('handlers conflict: ' + Object.keys(handlers).filter(k => k in allHandlers));

  logger.debug('registerMsgRequestHandlers', handlers);
  Object.assign(allHandlers, handlers);
  if (initialized) return;

  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    (async () => {
      const type = typeof msg === 'string' ? msg : msg.type;
      if (!allHandlers[type]) return;

      let res;
      try {
        res = await allHandlers[type](msg.data);
      } catch (error) {
        logger.error(error);

        if (error instanceof Error) res = { failed: true, error: error.message };
        else if (error.error)
          res = { failed: true, error: `${error.error.name}: ${error.error.message}` };
      }

      logger.debug(
        'registerMsgRequestHandlers.sendResponse',
        { type, handler: allHandlers[type] },
        res
      );
      sendResponse(res);
    })();
    return true;
  });
}

const ARE_YOU_ALIVE = 'ARE_YOU_ALIVE';
const YES_I_AM = 'YES_I_AM';

/**
 *
 * @param {(alive: boolean) => void} statusListener
 * * @param {() => void} invalidationHandler
 * @param {{interval?:number, requestTimeout?: number}} options
 * @default options {interval: 5000, requestTimeout: 1000}
 */
export function keepServiceWorkerAlive(
  statusListener,
  invalidationHandler,
  { interval = 5000, requestTimeout = 2000 } = {}
) {
  if (typeof invalidationHandler !== 'function')
    throw new Error('second argument (invalidationHandler) is required');
  if (typeof statusListener !== 'function')
    throw new Error('first argument (statusListener) is required');

  let state = null;
  const handler = async () => {
    const ref = setTimeout(() => statusListener(false), requestTimeout);

    try {
      chrome.runtime.sendMessage(ARE_YOU_ALIVE, response => {
        clearTimeout(ref);

        if (state !== response) {
          state = response;
          statusListener(state === YES_I_AM);
        }
      });
    } catch (error) {
      invalidationHandler(error);
    }
  };

  handler();
  const ref = setInterval(handler, interval);

  return () => clearInterval(ref);
}

export function listenKeepServiceWorkerAlive() {
  chrome.runtime.onMessage.addListener(
    (msg, _, sendResponse) => msg === ARE_YOU_ALIVE && sendResponse(YES_I_AM)
  );
}
