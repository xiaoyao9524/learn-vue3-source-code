import { mutableHandlers } from './baseHandlers';
import { isObject } from '@vue/shared';

export const reactiveMap = new WeakMap<object, any>();

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean;
  [ReactiveFlags.IS_REACTIVE]?: boolean;
  [ReactiveFlags.IS_READONLY]?: boolean;
  [ReactiveFlags.IS_SHALLOW]?: boolean;
  [ReactiveFlags.RAW]?: any;
}

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap);
}

function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  const existingProxy = proxyMap.get(target);

  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, baseHandlers);

  proxyMap.set(target, proxy);

  return proxy;
}

export const toReactive = <T extends unknown>(value: T) => {
  return isObject(value) ? reactive(value as object) : value;
};

export const isReactive = (value: unknown): boolean => {
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE]);
};
