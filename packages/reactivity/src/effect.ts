import { Dep, createDep } from './dep';
import { isArray } from '@vue/shared';

type KeyToDepMap = Map<any, Dep>;

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
export let activeEffect: ReactiveEffect | undefined;

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
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, (dep = createDep()));
  }

  trackEffects(dep);
}

/**
 * 利用 dep 依次跟踪指定key的所有effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!);
}

/**
 * 触发依赖
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targetMap.get(target);

  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);

  if (!dep) {
    return;
  }

  triggerEffects(dep);
}

/**
 * 依次触发 dep 中保存的依赖
 * @param dep
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep];

  for (let effect of effects) {
    triggerEffect(effect);
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  effect.run();
}
