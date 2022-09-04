export function replace_storage_local(key, replacer) {
  chrome.storage.local.get([key], async result => {
    chrome.storage.local.set({ [key]: replacer(result[key]) });
  });
}

export async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function DOMContentLoaded(callback) {
  if (document.readyState == 'loading') window.addEventListener('DOMContentLoaded', callback);
  else callback();
}

export function delayedPromise(handler, timeout = 2000) {
  return new Promise((res, rej) => setTimeout(() => handler(res, rej), timeout));
}

export function wait(timeMS) {
  return new Promise((res, rej) => setTimeout(() => res(), timeMS));
}

export function listTabs() {
  return chrome.tabs.query({});
}

export function currentTab() {
  return chrome.tabs.query({ active: true, currentWindow: true }).then(t => t?.[0]);
}
