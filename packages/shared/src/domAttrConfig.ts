import { makeMap } from './makeMap';

const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;

/**
 * 判断key是否为特殊布尔类型的attr，例如readonly
 * @param key 判断的key
 */
export const isSpecialBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs);

/**
 * 根据value判断是否包含布尔属性
 * 将value转化为布尔，另外如果value为空字符串也返回true
 * 主要针对场景：
 *    `{ multiple: '' } 也应该编译成 <select multiple>`
 * @param value
 * @returns
 */
export function includeBooleanAttr(value: unknown) {
  return !!value || value === '';
}
