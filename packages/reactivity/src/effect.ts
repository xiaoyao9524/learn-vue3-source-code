type KeyToDepMap = Map<any, ReactiveEffect>;

/**
 * targetMap:
 *    key: 响应性对象
 *    value: Map对象
 *        key: 响应对象的指定属性
 *        value: 指定对象属性的执行函数
 */
const targetMap = new WeakMap<object, KeyToDepMap>();

/**
 * 当前激活的依赖
 */
let activeEffect: ReactiveEffect | undefined;

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect<T>(fn);

  _effect.run();
}

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this;
    return this.fn();
  }
}

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  console.log("收集依赖");

  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  depsMap.set(key, activeEffect);

  console.log("targetMap: ", targetMap);
}

/**
 * 触发依赖
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  console.log("触发依赖");

  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const effect = depsMap.get(key) as ReactiveEffect;

  if (!effect) {
    return;
  }

  effect.fn();
}
