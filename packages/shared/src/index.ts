export const isArray = Array.isArray;

/**
 * 如果值有变化，返回true，否则返回false
 */
export const hasChanged = (val: any, oldValue: any): boolean =>
  !Object.is(val, oldValue);

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function';
};

export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

export const objectToString = Object.prototype.toString;

export const toTypeString = (val: unknown): string => {
  return objectToString.call(val);
};

/**
 * 判断val不为null并且typeof结果为object
 */
export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === 'object';
};

/**
 * 判断val是否为普通对象（{}）
 */
export const isPiniaObject = (val: unknown): val is object => {
  return toTypeString(val) === '[object Object]';
};

export const NOOP = () => {};

/**
 * 合并两个对象
 */
export const extend = Object.assign;

export const EMPTY_OBJ: { readonly [key: string]: any } = {};

const onRe = /^on[a-z]/;
export const isOn = (key: string) => onRe.test(key);

export * from './shapeFlags';

export * from './normalizeProps';

export * from './patchFlags';

export * from './domAttrConfig';
