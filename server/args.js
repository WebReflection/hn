import {readFileSync} from 'fs';
import {resolve} from 'path';

import {partial} from 'tag-params';

import umeta from 'umeta';
const {dirName} = umeta(import.meta);

const cache = new Map;

const exposeTemplate = page => page.replace(/<!--\$\{(.+?)\}-->/g, '${$1}');

const set = path => {
  const content = readFileSync(resolve(dirName, `../client/${path}`));
  const params = partial(exposeTemplate(content.toString()));
  cache.set(path, params);
  return params;
};

export default path => cache.get(path) || set(path);
