import { ReactiveEffect, isReactive } from '@vue/reactivity';
import { queuePreFlushCb } from './scheduler';
import { callWithAsyncErrorHandling } from './errorHandling';
import {
  NOOP,
  EMPTY_OBJ,
  isObject,
  isPiniaObject,
  hasChanged
} from '@vue/shared';

export interface WatchOptions<immediate = boolean> {
  immediate?: immediate;
  deep?: boolean;
}

export function watch(
  source: unknown,
  cb: Function,
  options: WatchOptions = {}
) {
  return doWatch(source, cb, options);
}

function doWatch(
  source: any,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  let getter: () => any;

  if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else {
    getter = NOOP;
  }

  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let job = () => {
    if (!effect.active) {
      return;
    }

    if (cb) {
      const newValue = effect.run();

      if (deep || hasChanged(newValue, oldValue)) {
        callWithAsyncErrorHandling(cb, [newValue, oldValue]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };

  const scheduler = () => queuePreFlushCb(job);

  let oldValue = EMPTY_OBJ;

  const effect = new ReactiveEffect(getter, scheduler);

  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else {
    effect.run();
  }

  /** unwatch */
  return () => {
    effect.stop();
  };
}

/**
 * 遍历value
 * · 如果是对象，那么会递归遍历每个属性，触发每一个key的一次getter去收集依赖
 * @param value 要遍历的值
 * @returns 返回value
 */
export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value;
  }

  if (isPiniaObject(value)) {
    for (let key in value) {
      traverse(value[key]);
    }
  }

  return value;
}
