import { RendererOptions, RenderNode } from '@vue/runtime-core';

export const svgNS = 'http://www.w3.org/2000/svg';

const doc = (typeof document !== 'undefined' ? document : null) as Document;

export const nodeOps: Omit<RendererOptions, 'patchProp'> = {
  /**
   * 插入节点
   * @param child 往parent里插入的节点
   * @param parent child将要插入这个节点
   * @param anchor 将要插在这个节点之前
   */
  insert: (child: Node, parent: Element, anchor?: Node | null | undefined) => {
    parent.insertBefore(child, anchor || null);
  },
  /**
   * 删除一个element
   * @param el 要删除的element
   */
  remove: (el: Element) => {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
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
   * 创建一个文本节点
   * @param text 文本
   * @returns 创建的文本节点
   */
  createText: (text: string) => doc.createTextNode(text),
  /**
   * 创建一个注释节点
   * @param text 文本
   * @returns 创建的注释节点
   */
  createComment: (text: string) => doc.createComment(text),
  /**
   * 为一个elemnt设置nodeValue
   * @param parent
   * @param text
   */
  setText: (node: Element, text: string) => {
    node.nodeValue = text;
  },
  /**
   * 为指定的 element 设置文本
   * @param el 指定的element
   * @param text 要设置的文本
   */
  setElementText: (el: Element, text: string) => {
    el.textContent = text;
  }
};
