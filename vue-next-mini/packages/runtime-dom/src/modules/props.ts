import { includeBooleanAttr } from '@vue/shared';

/**
 * 修补dom属性（非attr）
 * @param el element
 * @param key props key
 * @param value 新的值
 */
export function patchDOMProp(el: any, key: string, value: any) {
  if (
    key === 'value' &&
    el.tagName !== 'PROGRESS' &&
    // 排除自定义元素，自定义元素可以使用'_value'
    !el.tagName.includes('-')
  ) {
    el._value = value;
    const newValue = value === null ? '' : value;
    /**
     * 官方注释：
     *      总是为OPTION元素设置，
     *    因为如果没有value属性，它的值会返回到textContent。
     *    并且为OPTION设置.value没有副作用
     */
    if (el.value !== newValue || el.tagName === 'OPTION') {
      el.value = newValue;
    }

    if (value === null) {
      el.removeAttribute(key);
    }
    return;
  }

  let needRemove = false;

  if (value === '' || value === null) {
    const type = typeof el[key];

    if (type === 'boolean') {
      // 例如<select multiple> 编译为 { multiple: '' }
      value = includeBooleanAttr(value);
    } else if (value === null && type === 'string') {
      // 例如 <div :id="null">
      value = '';
      needRemove = true;
    } else if (type === 'number') {
      // 例如 <img :width="null">
      // 有些IDL参数的值必须大于0, 例如 input.size = 0 会抛出错误
      value = 0;
      needRemove = true;
    }
  }

  try {
    el[key] = value;
  } catch (e: any) {
    console.warn(`
      在<${el.tagName.toLowerCase()}>上设置属性"${key}"失败，value ${value} 无效。
    `);
  }

  needRemove && el.removeAttribute(key);
}
