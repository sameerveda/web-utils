import { once } from 'lodash';

export const pop_badge = once(() => {
  const el = document.createElement('span');

  el.setAttribute(
    'style',
    `display: block;
    position: absolute;
    top: 0;
    background: lightgreen;
    border-radius: 7px;
    color: white;
    padding: 2px 4px;`
  );
  el.addEventListener('click', () => el.remove());
  return {
    mount: (parent, text) => {
      if (!text) throw new Error('text not specified');

      el.innerText = text;
      parent.appendChild(el);

      setTimeout(() => el.remove(), 1000);
    },
  };
});

/**
 *
 * @param {HTMLElement} el
 * @param {string} text
 * @returns
 */
export function copyOnClick(el, text) {
  const handler = async () => {
    try {
      await navigator.clipboard.writeText(text);
      pop_badge().mount(el, 'Copied');
    } catch (error) {
      console.error(error);
      pop_badge().mount(el, 'Failed to copy');
    }
  };
  el.addEventListener('click', handler);

  return {
    update: value => (text = value),
    destroy: () => el.removeEventListener('click', handler),
  };
}
