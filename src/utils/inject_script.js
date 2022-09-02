import { logger } from './logger';

export default function injectScript(filePath, is_dev = false, prepend = false) {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(filePath);
  s.async = true;

  prepend
    ? (document.head || document.documentElement).prepend(s)
    : (document.head || document.documentElement).appendChild(s);
    
  if (!is_dev) s.onload = () => s.remove();

  logger.debug('script injected: ', is_dev ? s.src : filePath);
}
