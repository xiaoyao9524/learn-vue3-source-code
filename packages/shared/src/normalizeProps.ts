import { isArray, isObject, isString } from '.';

/**
 * 标准化class，将class（可能是string、array或对象）转化成字符串
 * @param value class对象
 * @returns class字符串
 */
export function normalizeClass(value: unknown): string {
  let res = '';

  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      let normalized = normalizeClass(value[i]);

      res += normalized + ' ';
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + ' ';
      }
    }
  }

  return res.trim();
}
