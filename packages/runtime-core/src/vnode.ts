import {
  ShapeFlags,
  isArray,
  isFunction,
  isObject,
  isString,
  normalizeClass
} from '@vue/shared';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');
export const Comment = Symbol('Comment');

export interface VNode {
  __v_isVNode: true;
  type: any;
  props: any;
  children: any;
  shapeFlag: number;
  patchFlag: number;
  el: any;
}

export const isVNode = (value: any): value is VNode => {
  return value ? value.__v_isVNode === true : false;
};

export function createVNode(type: any, props?: any, children?: any): VNode {
  if (props) {
    const { class: klass } = props;

    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
  }

  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0; // 第一次计算shapeFlag，本次为dom类型的计算

  return createBaseVNode(type, props, children, shapeFlag);
}

function createBaseVNode(type, props, children, shapeFlag): VNode {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    shapeFlag, // 根据children类型不同计算而来
    patchFlag: 0,
    children
  } as VNode;

  normalizeChildren(vnode, children);

  return vnode;
}

/**
 * code                                                       shapeFlag      type
 * h(component)                                               4              {render: f()}
 * h(Vue.Text, '这是一个文本节点')                              8              Symbol(Text)
 * h(Vue.Comment, '这是一个注释节点')                           8              Symbol(Comment)
 * h(Fragment, '这是一个碎片节点')                              8              Symbol(Fragment)
 * h('div', 'hello render')                                    9             'div'
 * h(Vue.Fragment, [...]);                                     16             Symbol(Fragment)
 * h('div', [h('p', 'p1'), h('p', 'p2')])                      17            'div'
 */

/**
 * 正常化children，主要是根据children类型的不同计算最终vnode的shapeFlag
 * @param vnode 虚拟dom
 * @param children children
 */
export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0;

  const { shapeFlag } = vnode;

  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === 'object') {
  } else if (isFunction(children)) {
  } else {
    // 说明是字符串
    children = String(children);
    type = ShapeFlags.TEXT_CHILDREN;
  }

  vnode.children = children;
  vnode.shapeFlag |= type; // 第二次计算shapeFlag，本次是计算children的类型
}

/**
 * |= （按位或） 简单介绍
 * 1 |= 2
 * 1 的二进制为 0001
 * 2 的二进制为 0010
 * 按位或结果为 0011，所以结果为3
 *
 * 1 |= 8
 * 1 的二进制为 0001
 * 8 的二进制为 1000
 * 按位或结果为 1001，所以结果为9
 */
