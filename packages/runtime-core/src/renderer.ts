import { ShapeFlags } from '@vue/shared';
import { VNode, Text } from './vnode';

export function createRenderer(options: any) {
  return baseCreateRenderer(options);
}

function baseCreateRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    cloneNode: hostCloneNode
  } = options;
  /**
   * 对比两个虚拟dom
   * @param n1 旧的vnode
   * @param n2 新的vnode
   * @param container 容器
   */
  const patch = (n1: VNode, n2: VNode, container: any) => {
    if (n1 === n2) {
      return;
    }

    const { type, shapeFlag } = n2;
    switch (type) {
      case Text: {
        break;
      }
      default: {
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        }
      }
    }
  };

  /**
   * 如果没有旧的vnode，那么挂载新的vnode，否则就去对比两个vnode
   * @param n1 旧的vnode
   * @param n2 新的vnode
   * @param container 容器
   */
  const processElement = (n1: VNode | null, n2: VNode, container) => {
    if (n1 === null) {
      // 说明之前没有元素，属于第一次挂载
      mountElement(n2, container);
    }
  };

  /**
   * 根据虚拟dom挂载元素
   * @param vnode 要挂载的vnode
   * @param container 容器
   */
  const mountElement = (vnode: VNode, container, isSVG = false) => {
    let el: any;

    const { type, props, shapeFlag } = vnode;

    if (vnode.el && hostCloneNode !== undefined) {
    } else {
      el = vnode.el = hostCreateElement(type, isSVG, props);
    }

    // 如果children是文本的话，去设置文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children as string);
    }
  };

  const render = (vnode: VNode, container: any) => {
    if (vnode === null) {
    } else {
      patch(container._vnode || null, vnode, container);
    }
  };

  return {
    render
  };
}
