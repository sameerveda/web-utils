import json5 from 'json5';
import { camelCase, mapKeys } from 'lodash-es';

export const camlizeKeys = json => mapKeys(json, (_, k) => camelCase(k));
export function parse(content, transform) {
  try {
    return [transform ? transform(json5.parse(content)) : json5.parse(content)];
  } catch (error) {
    return [null, String(error)];
  }
}

export const stringify = s => json5.stringify(s, null, 2);
