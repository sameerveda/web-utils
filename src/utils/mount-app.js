export default (App, props) => {
  const target = document.currentScript.getAttribute('target');
  target &&
    new App({
      target: document.querySelector(target),
      props: { ...props, ...JSON.parse(document.currentScript.getAttribute('props') || '{}') },
    });
};
