import { hyphenate } from '@vue/shared';
import { callWithAsyncErrorHandling } from 'packages/runtime-core/src/errorHandling';

let _getNow = Date.now;

export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  el.addEventListener(event, handler, options);
}

export function removeEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  el.removeEventListener(event, handler, options);
}

interface Invoker extends EventListener {
  value: EventValue;
  attached: number;
}

type EventValue = Function | Function[];

export function patchEvent(
  el: Element & { _vei?: Record<string, Invoker | undefined> },
  rawName: string,
  prevValue: EventValue | null,
  nextValue: EventValue | null
) {
  // vei = vue event invikers (vue事件调用程序)
  /**
   * vue 事件绑定大致流程
   * 别名说明：
   *  invoker（Function）: vue最后真正绑定的事件处理函数
   *  fn（Function）: @click="fn"写代码时真正需要被执行的fn
   *
   * 1.会将invoker.value = fn，事件触发时会执行invoker函数，invoker函数会执行invoker.value(也就是@click的函数)
   * 2.绑定的时候最后会执行'el.addEventListener('click', invoker)'来绑定事件
   * 3.更新事件时只会修改invoker.value
   * 4.删除事件最后会执行'el.removeEventListener('click', invoker)'来解绑事件
   */
  // incokers会储存element绑定的所有事件，例如{'onClick': invoker}
  // 解绑的时候会执行el.removeEventListener('click', invokers['onClick'])
  const invokers = el._vei || (el._vei = {});

  const existingInvoker = invokers[rawName];

  if (nextValue && existingInvoker) {
    // 如果上次和本次都有的事件，那么只要修改invokers.value就可以
    existingInvoker.value = nextValue;
  } else {
    const [name] = parseName(rawName);

    // 如果只是本次有，那么需要创建invoker并且绑定事件
    if (nextValue) {
      const invoker = (invokers[rawName] = createInvoker(nextValue));

      addEventListener(el, name, invoker);
    } else if (existingInvoker) {
      // 如果只是上次有本次没有，那么需要解绑事件并从incokers中删掉对应的项
      removeEventListener(el, name, existingInvoker);
      invokers[rawName] = undefined;
    }
  }
}

function parseName(rawName: string): [string] {
  // 还应该处理事件修饰符的情况
  return [hyphenate(rawName.slice(2))];
}

function createInvoker(initialValue: EventValue): Invoker {
  const invoker: Invoker = (e: Event) => {
    const timeStamp = e.timeStamp || _getNow();

    // if (timeStamp >= invoker.attached - 1) {
    callWithAsyncErrorHandling(invoker.value as Function, [e]);
    // }
  };

  invoker.value = initialValue;
  invoker.attached = _getNow();

  return invoker;
}

// function patchStopImmediatePropagation(e: Event, value: EventValue) {
//   return value;
// }
