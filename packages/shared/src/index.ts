export const isArray = Array.isArray;

export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object';

/**
 * 如果值有变化，返回true，否则返回false
 */
export const hasChanged = (val: any, oldValue: any): boolean =>
  !Object.is(val, oldValue);

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function';
};

export const NOOP = () => {};
