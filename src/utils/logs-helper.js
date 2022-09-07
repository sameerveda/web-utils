import { size } from 'lodash';
import { FirestoreCollectionWrap } from './firestore-collection-wrap';

/**
 * @type {FirestoreCollectionWrap}
 */
let collection;

export function initLogCollection(
  colName = document.currentScript.getAttribute('log-col-name') || 'web-utils-log'
) {
  if (collection) throw new Error('already initialized');
  collection = new FirestoreCollectionWrap(colName);
}

function ensureInit() {
  if (!collection) throw new Error('collection not initialized. call initLogCollection');
}

export function getLogs() {
  ensureInit();

  return collection.getDocsAll().then(data =>
    Object.entries(data)
      .sort(([k1], [k2]) => +k1 - +k2)
      .map(([id, v]) => ({ id, ...v.data() }))
  );
}

export function addLog(data) {
  if ((!data?.title && !data?.content) || !data?.date) {
    console.error(data);
    throw new Error('invalid log data');
  }
  const id = String(Date.now());
  collection.setDoc(id, data);
  return { id, ...data };
}
