import {
  ShapeFlags,
  isArray,
  isFunction,
  isObject,
  isString,
  normalizeClass
} from '@vue/shared';

import { Data } from './component';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');
export const Comment = Symbol('Comment');

export interface RenderNode {
  [key: string]: any;
}

export type VNodeProps = {
  key?: string | number | symbol;
};

export interface VNode {
  __v_isVNode: true;
  type: any;
  props: any;
  key?: string | number;
  children: any;
  shapeFlag: number;
  patchFlag: number;
  el: any;
  anchor: RenderNode | null;
  memo?: boolean;
}

export const isVNode = (value: any): value is VNode => {
  return value ? value.__v_isVNode === true : false;
};

/**
 * 判断两个vnode是否是同一类型
 * @param n1 旧的vnode
 * @param n2 新的vnode
 * @returns true代表是同一类型，直接修改原dom，否则需要销毁重建
 */
export const isSameVNodeType = (n1: VNode, n2: VNode): boolean => {
  return n1.type === n2.type && n1.key === n2.key;
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

// export function cloneIfMounted(child: VNode): VNode {
//   return child.el == null || child.memo ? child : cloneVNode(child);
// }

// export function cloneVNode(
//   child: VNode,
//   extraProps?: (Data & VNodeProps) | null
// ): VNode {}

export function normalizeVNode(child?: VNode | null): VNode {
  if (child == null || typeof child === 'boolean') {
    return createVNode(Comment);
  } else if (isArray(child)) {
    // fragment
    return createVNode(
      Fragment,
      null,
      // 重用child时避免引用污染
      child.slice()
    );
  } /* else if (typeof child === 'object') {
    return cloneIfMounted(child); // 暂不处理此情况
  } */ else {
    // child为string或number
    return createVNode(Text, null, String(child));
  }
}
