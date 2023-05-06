/**
 * 根据value为dom元素添加或删除class
 * @param el 要添加class的元素
 * @param value 要添加的class
 */
export const patchClass = (el: Element, value: string | null = null) => {
  if (!value) {
    el.removeAttribute('class');
  } else {
    el.className = value;
  }
};
