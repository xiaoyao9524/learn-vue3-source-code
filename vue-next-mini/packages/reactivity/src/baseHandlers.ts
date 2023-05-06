import { track, trigger } from './effect';
import { ReactiveFlags } from './reactive';

const get = createGetter();

function createGetter(isReadonly = false) {
  return function get(target: object, key: string | symbol, receiver: object) {
    switch (key) {
      case ReactiveFlags.IS_REACTIVE:
        return !isReadonly;
    }
    const res = Reflect.get(target, key, receiver);

    track(target, key);

    return res;
  };
}

const set = createSetter();

function createSetter() {
  return function set(
    target: object,
    key: string | symbol,
    value: any,
    receiver: object
  ) {
    const result = Reflect.set(target, key, value, receiver);

    trigger(target, key, value);

    return result;
  };
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set
};
