import { isArray, isObject } from '@vue/shared';
import { VNode, createVNode, isVNode } from './vnode';

/*
// 只有type
h('div')

// type + props
h('div', {})

// type + 省略props + children
// 省略props不支持具名插槽
h('div', []) // array children
h('div', 'foo') // text节点
h('div', h('br')) // vnode
h(Component, () => {}) // default slot

// type + props + children
h('div', {}, []) // array
h('div', {}, 'foo') // text
h('div', {}, h('br')) // vnode
h(Component, {}, () => {}) // default slot
h(Component, {}, {}) // named slots

// 没有props的具名插槽需要显式的null来避免歧义
h(Component, null, {})
*/

/**
 * 处理参数，判断出type、props、children
 * @param type 虚拟dom类型
 * @param propsOrChildren props或children
 * @param children children
 * @returns vnode
 */
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length;

  // 如果只有两个参数，那么第二个参数有可能是props，也可能是children
  if (l === 2) {
    // ↓如果第二个参数是对象并且不是数组的话，那么说明有可能是props或者单个的vnode
    if (isObject(propsOrChildren) && isArray(propsOrChildren)) {
      // ↓说明是单个的vnode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      // ↓说明第二个参数是props
      return createVNode(type, propsOrChildren);
    } else {
      // 说明没有props，第二个参数是children
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    // ↑说明参数不是两个
    if (l > 3) {
      // ↑说明第二个参数为props，从第三个参数开始都是children
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      // ↑说明第二个参数为props，并且第三个参数为单个的vnode
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
