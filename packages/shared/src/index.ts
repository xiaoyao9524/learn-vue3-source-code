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

/**
 * 创建一个缓存字符串的对象
 * 如果传入的str不存在于缓存对象中，那么将对象的str设置成传入函数的执行结果
 * 如果存在，那么返回缓存中的值
 * @param fn 用来处理str的fn函数
 * @returns
 */
const cacheStringFunction = <T extends (str: string) => string>(fn: T) => {
  const cache: Record<string, string> = Object.create(null);

  return ((str: string) => {
    const hit = cache[str];

    return hit || (cache[str] = fn(str));
  }) as any;
};

const camelizeRe = /-(\w)/g;
// 将一个字符串转为驼峰模式
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRe, (_, c) => (c ? c.toUpperCase() : ''));
});

export * from './shapeFlags';

export * from './normalizeProps';

export * from './patchFlags';

export * from './domAttrConfig';
