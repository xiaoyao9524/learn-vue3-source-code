export const svgNS = 'http://www.w3.org/2000/svg';

const doc = (typeof document !== 'undefined' ? document : null) as Document;

export const nodeOps: any = {
  /**
   * 根据tag创建真实dom
   * @param tag dom标签
   * @param isSVG 是否是svg
   * @param props 如果是select元素那么根据props.multiple判断是否添加'multiple'属性
   * @returns 创建的真实dom
   */
  createElement: (tag, isSVG, props): Element => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag);

    if (tag === 'select' && props && props.multiple != null) {
      (el as HTMLSelectElement).setAttribute('multiple', props.multiple);
    }

    return el;
  },
  /**
   * 为一个真实元素设置文本内容
   * @param el 要设置文本的元素
   * @param text 要设置的文本
   */
  setElementText: (el: Element, text: string) => {
    el.textContent = text;
  }
};
