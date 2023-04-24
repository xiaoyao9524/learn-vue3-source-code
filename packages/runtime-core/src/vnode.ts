import { ShapeFlags, isArray, isFunction, isString } from '@vue/shared';

export interface VNode {
  __v_isVNode: true;
  type: any;
  props: any;
  children: any;
  shapeFlag: number;
}

export const isVNode = (value: any): value is VNode => {
  return value ? value.__v_isVNode === true : false;
};

export function createVNode(type: any, props?: any, children?: any): VNode {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

  return createBaseVNode(type, props, children, shapeFlag);
}

function createBaseVNode(type, props, children, shapeFlag): VNode {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    shapeFlag,
    children
  } as VNode;

  normalizeChildren(vnode, children);

  return vnode;
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0;

  const { shapeFlag } = vnode;
  if (children === null) {
    children = null;
  } else if (isArray(children)) {
  } else if (typeof children === 'object') {
  } else if (isFunction(children)) {
  } else {
    // 说明是字符串
    children = String(children);
    type = ShapeFlags.TEXT_CHILDREN;
  }

  vnode.children = children;
  vnode.shapeFlag |= type;
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
