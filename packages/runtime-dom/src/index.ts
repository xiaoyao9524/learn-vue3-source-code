import { extend } from '@vue/shared';

import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';

import { createRenderer } from '@vue/runtime-core';

let renderer: any = null;

const rendererOptions = extend({ patchProp }, nodeOps);

export const render = (...args) => {
  return ensureRender().render(...args);
};

function ensureRender() {
  return renderer || createRenderer(rendererOptions);
}
