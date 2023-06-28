export function pageLink(node: HTMLLinkElement, link: string) {
  const isLink = node.tagName === 'A' || node.tagName === 'a';
  let url: string;

  const handler = e => (e.preventDefault(), url ? chrome.tabs.create({ url }) : chrome.runtime.openOptionsPage());

  function update(link: string) {
    url = link && chrome.runtime.getURL(link);
    if (isLink) {
      node.href = url;
      node.target = '_blank';
    }
  }

  update(link);
  isLink || node.addEventListener('click', handler);

  return {
    update,
    destroy: () => isLink || node.removeEventListener('click', handler),
  };
}
