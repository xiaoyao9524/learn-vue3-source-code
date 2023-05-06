/**
 * 根据str创建一个对象并返回一个函数来判断某个key是否存在于这个对象中
 * @param str 一个由 ','分隔的字符串，用来生成对象
 * @param expectsLowerCase 是否将传进来的key转化为小写
 * @returns 传入的key是否存在于对象中
 */

export function makeMap(str: string, expectsLowerCase?: boolean) {
  const map = Object.create(null);

  const list = str.split(',');

  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase
    ? (val: string) => !!map[val.toLowerCase()]
    : (val: string) => !!map[val];
}
