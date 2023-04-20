import { ReactiveEffect, isReactive } from '@vue/reactivity';
import { queuePreFlushCb } from './scheduler';
import { callWithAsyncErrorHandling } from './errorHandling';
import { NOOP, isObject, isPiniaObject } from '@vue/shared';

interface WatchOptions {
  immediate?: boolean;
  deep?: boolean;
}

export function watch(source: unknown, cb: any, options: WatchOptions = {}) {
  return doWatch(source, cb, options);
}

function doWatch(source: any, cb: any, { immediate, deep }: WatchOptions = {}) {
  let getter: () => any;

  if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else {
    getter = NOOP;
  }

  let job = () => {
    if (!effect.active) {
      return;
    }

    if (cb) {
      const newValue = effect.run();

      if (deep) {
        callWithAsyncErrorHandling(cb, [newValue, oldValue]);
      }
    } else {
      effect.run();
    }
  };

  const scheduler = () => queuePreFlushCb(job);

  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let oldValue = {};

  const effect = new ReactiveEffect(getter, scheduler);

  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  }

  /** unwatch */
  return () => {};
}

/**
 * 遍历value
 * · 如果是对象，那么会遍历每个属性
 * @param value 要遍历的值
 * @param seen ??
 * @returns 返回value
 */
export function traverse(value: unknown /*seen?: Set<unknown>*/) {
  if (!isObject(value)) {
    return value;
  }
  // seen暂时没用到，先忽视
  // seen = seen || new Set();

  // if (seen.has(value)) {
  //   return value;
  // }

  // seen.add(value);

  if (isPiniaObject(value)) {
    for (let key in value) {
      traverse(value[key] /*, seen*/);
    }
  }

  return value;
}
