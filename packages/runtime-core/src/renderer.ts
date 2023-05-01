import { ShapeFlags, PatchFlags, EMPTY_OBJ } from '@vue/shared';
import { VNode, Text, Comment, Fragment } from './vnode';
export interface RendererOptions {
  /**
   * 为指定的 element 的props打补丁
   * @param el 指定的元素
   * @param key 指定的props key
   * @param prevValue 上一次的值
   * @param nextValue 本次的值
   */
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void;
  /**
   * 为指定的 element 设置文本
   * @param el 指定的element
   * @param text 要设置的文本
   */
  setElementText(el: Element, text: string): void;
  /**
   * 插入节点
   * @param child 往parent里插入的节点
   * @param parent child将要插入这个节点
   * @param anchor 将要插在这个节点之前
   */
  insert(child: Node, parent: Element, anchor?: Node): void;
  /**
   * 创建 element
   * @param tag dom标签
   * @param isSVG 是否是svg
   * @param props 如果是select元素那么根据props.multiple判断是否添加'multiple'属性
   * @returns 创建的真实dom
   */
  createElement(tag: string, isSVG: boolean, props: any): Element;
}

export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options);
}

function baseCreateRenderer(options: RendererOptions) {
  const {
    insert: hostInsert,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    setElementText: hostSetElementText
  } = options;
  /**
   * 为新的虚拟dom打补丁
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
      case Comment:
        break;
      case Fragment:
        break;
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
    if (n1 == null) {
      // 说明之前没有元素，属于第一次挂载
      mountElement(n2, container);
    } else {
      patchElement(n1, n2);
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

    if (vnode.el) {
    } else {
      // 1.创建 element
      el = vnode.el = hostCreateElement(type, isSVG, props);

      // 如果children是文本的话，去设置文本
      // 2.设置文本
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, vnode.children as string);
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      }

      // 3.设置 props
      if (props) {
        for (let key in props) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
      // 4.插入 element
      hostInsert(el, container);
    }

    container._vnode = vnode;
  };

  /**
   * 修补 Element
   * @param n1 旧的VNode
   * @param n2 新的VNode
   */
  const patchElement = (n1: VNode, n2: VNode) => {
    const el = (n2.el = n1.el);

    let {
      /*patchFlag*/
    } = n2;

    // patchFlag |= n1.patchFlag & PatchFlags.FULL_PROPS;

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    patchChildren(n1, n2, el, null);

    patchProps(el, n2, oldProps, newProps);
  };

  /**
   * 修补 children
   * @param n1 旧的vnode
   * @param n2 新的vnode
   * @param container vnode对应的真实 element
   * @param anchor 锚点
   */
  const patchChildren = (
    n1: VNode,
    n2: VNode,
    container: Element,
    anchor?: Element | null
  ) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2 && n2.children;

    const { shapeFlag, props } = n2;

    /**
     * children 有三种情况：
     *    1.text children
     *    2.array children
     *    3.无chilaren
     */

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 走这里说明新节点是text children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 旧节点是array children
        // 新节点是text children
        // TODO: 执行卸载旧子节点操作
      }
      // 如果本次和上次不一样，那么直接去挂载新的文本节点
      if (c2 !== c1) {
        hostSetElementText(container, c2 as string);
      }
    } else {
      // 走这里说明新节点是array children或无children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 走这里说明旧节点是array children
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 走这里说明新旧节点都是array children
          // TODO: diff
        } else {
          // 旧节点是array children
          // 走这里说明新节点是空
          // TODO: 直接卸载节点
        }
      } else {
        // 旧节点是：text children、空节点
        // 新节点是：array children、空children
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 旧节点：textchildren
          // 新节点：array children、空children
          // 执行：删除旧节点的text children
          hostSetElementText(container, '');
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 旧节点是：text children、空节点
          // 新节点是：array children
          // TODO: 单独新子节点的挂载
        }
      }
    }
  };

  /**
   * 为props打补丁
   * @param el 指定的element
   * @param n2 新的vnode
   * @param oldProps 旧的props
   * @param newProps 新的props
   */
  const patchProps = (el: Element, n2: VNode, oldProps: any, newProps: any) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const next = newProps[key];
        const prev = oldProps[key];

        if (next !== prev && key !== 'value') {
          hostPatchProp(el, key, prev, next);
        }
      }

      // 删除存在于旧prop但是不存在于新prop的属性
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }

      if ('value' in newProps) {
        hostPatchProp(el, 'value', oldProps.value, newProps.value);
      }
    }
  };

  const render = (vnode: VNode, container: any) => {
    if (vnode === null) {
      // TODO: 卸载
    } else {
      patch(container._vnode || null, vnode, container);
    }
  };

  return {
    render
  };
}
