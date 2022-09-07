import { initializeApp } from 'firebase/app';
import {
  doc as _doc,
  getDoc as _getDoc,
  getFirestore,
  setDoc as _setDoc,
  updateDoc as _updateDoc,
  deleteField as _deleteField,
  getDocs as _getDocs,
  where,
  collection,
  documentId,
  query,
} from 'firebase/firestore/lite';
import logger from './logger';
import { applyMapper } from './data-mappers';
import { META_KEY } from './keys';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function processData(data, nullValue = v => v) {
  return Object.fromEntries(
    Object.entries(data).map(([s, t]) => [s, t == null ? nullValue(t) : applyMapper(t)])
  );
}

export class FirestoreCollectionWrap {
  constructor(name) {
    this.name = name;
    if (!this.name) throw new Error('collection name is required');
  }

  doc(key) {
    return _doc(db, this.name, key);
  }

  /**
   *
   * @param {string[]} keys
   */
  async getDocsMany(keys) {
    if (!Array.isArray(keys)) throw new Error('keys should be an array');

    const allData = {};

    //because: "Invalid Query. 'in' filters support a maximum of 10 elements in the value array."
    for (let n = 0; n < keys.length; n += 10) {
      const data = await _getDocs(
        query(
          collection(db, this.name),
          where(documentId(), 'in', keys.slice(n, Math.min(n + 10, keys.length)))
        )
      ).then(response => response.docs);

      data.forEach(d => (allData[d.id] = d.data()));
    }

    return allData;
  }

  getDocsAll() {
    return _getDocs(collection(db, this.name)).then(response => response.docs);
  }

  /**
   * @param {string} key
   */
  getDoc(key) {
    logger.debug('getDoc(key)', { key });
    return _getDoc(this.doc(key)).then(d => d.data());
  }

  getMeta() {
    return (this.meta = this.getDoc(META_KEY));
  }

  async updateMeta() {
    if (!this.meta) await this.getMeta();
    this.setDoc(
      META_KEY,
      (this.meta = { updated: new Date(), version: +this.meta?.version + 1 || 1 })
    );
  }

  /**
   * @param {string} key
   */
  setDoc(key, data) {
    logger.debug('setDoc(key, data)', { key, data });
    return _setDoc(this.doc(key), processData(data));
  }

  /**
   * @param {string} key
   */
  async updateDoc(key, data) {
    logger.debug('updateDoc(key, data)', { key, data });
    const entries = Object.entries(data);
    if (!entries.length) return false;
    await _updateDoc(
      this.doc(key),
      processData(data, () => _deleteField())
    );
    return true;
  }

  /**
   * @param {string} key
   */
  mergeDoc(key, data) {
    logger.debug('mergeDoc(key, data)', { key, data });
    return _setDoc(this.doc(key), data, { merge: true });
  }

  deleteField(key, field) {
    logger.debug('deleteField(key, field)', { key, field });
    return _updateDoc(this.doc(key), {
      [field]: _deleteField(),
    });
  }
}
