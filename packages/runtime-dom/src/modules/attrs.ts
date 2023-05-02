import { isSpecialBooleanAttr, includeBooleanAttr } from '@vue/shared';

export function patchAttr(el: Element, key: string, value: any) {
  // 判断这个key是否为特殊的布尔类型的attr
  const isBoolean = isSpecialBooleanAttr(key);

  if (value === null || (isBoolean && !includeBooleanAttr(value))) {
    /**
     * 1.没有value
     * 2.并且是特殊布尔类型的attr
     * 3.并且经过判断后这个attr不应该存在
     * 4.说明需要removeAttribute
     */
    el.removeAttribute(key);
  } else {
    // 如果是特殊布尔类型的key的话，那么设置为空字符串就可以正确添加了
    el.setAttribute(key, isBoolean ? '' : value);
  }
}
