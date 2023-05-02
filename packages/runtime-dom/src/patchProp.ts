import { isOn } from '@vue/shared';
import { patchClass } from './modules/class';
import { patchDOMProp } from './modules/props';
import { patchAttr } from './modules/attrs';
import { patchStyle } from './modules/style';

/**
 * 把单个prop添加到元素上
 * @param el 元素
 * @param key 要添加的props key
 * @param prevValue 旧的值
 * @param nextValue 新的值
 */
export const patchProp: any = (
  el: Element,
  key: string,
  prevValue: any,
  nextValue: any
) => {
  if (key === 'class') {
    patchClass(el, nextValue);
  } else if (key === 'style') {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
  } else {
    if (shouldSetAsProp(el, key)) {
      // 执行修改prop
      patchDOMProp(el, key, nextValue);
    } else {
      // 执行修改attribute
      patchAttr(el, key, nextValue);
    }
  }
};

/**
 * 判断一个key是否属于prop，如果不是那么属于attr
 * @param el 元素
 * @param key key
 * @returns boolean，是否属于prop
 */
function shouldSetAsProp(el: Element, key: string): boolean {
  if (key === 'form') {
    return false;
  }

  if (key === 'list' && el.tagName === 'INPUT') {
    return false;
  }

  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false;
  }

  return key in el;
}
