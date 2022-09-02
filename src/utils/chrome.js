// svelte throws error when chrome accessed directly
export default chrome;

let _hasExtensionContext = false;
let _hasDocument = false;

try {
  _hasExtensionContext = !!chrome?.runtime?.onMessage;
} catch (error) {}

try {
  _hasDocument = !!document;
} catch (error) {}

export const hasExtensionContext = _hasExtensionContext;
export const hasDocument = _hasDocument;
