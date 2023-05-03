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
  const invokers = el._vei || (el._vei = {});

  const existingInvoker = invokers[rawName];

  if (nextValue && existingInvoker) {
    // 如果上次和本次都有某个事件，那么只要修改invokers.value就可以
    existingInvoker.value = nextValue;
  } else {
    const [name] = parseName(rawName);

    if (nextValue) {
      const invoker = (invokers[rawName] = createInvoker(nextValue));

      addEventListener(el, name, invoker);
    } else if (existingInvoker) {
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
