import { isOn } from '@vue/shared';
import { patchClass } from './modules/class';

/**
 * 把单个prop添加到元素上
 * @param el 元素
 * @param key 要添加的props key
 * @param prevValue 旧的值
 * @param nextValue 新的值
 */
export const patchProp: any = (el, key, prevValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue);
  } else if (key === 'style') {
  } else if (isOn(key)) {
  } else {
  }
};
