import {readFileSync} from 'fs';
import {resolve} from 'path';

import umeta from 'umeta';
const {dirName} = umeta(import.meta);

const cache = new Map;

const set = path => {
  const template = ''.split.call(
    readFileSync(resolve(dirName, `../client/${path}`)),
    /<!--👻[\s\S]*?-->/
  );
  cache.set(path, template);
  return template;
};

export default path => cache.get(path) || set(path);
