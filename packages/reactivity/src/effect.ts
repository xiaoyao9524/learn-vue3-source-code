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

export type EffectSchedular = (...args: any[]) => any;

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect<T>(fn);

  _effect.run();
}

export class ReactiveEffect<T = any> {
  public computed?: any;
  /**
   * @param fn 当前副作用的函数
   * @param scheduler 在触发依赖时调用，如果没有，则触发时调用this.run
   */
  /**
   * public fn: () => T,
     public scheduler: EffectScheduler | null = null,
   */
  constructor(
    public fn: () => T,
    public scheduler: EffectSchedular | null = null
  ) {}

  run() {
    activeEffect = this;
    return this.fn();
  }
}

/**
 * 将当前副作用添加到targetMap -> target -> key -> dep中
 * @param target 要添加依赖的target
 * @param key    要添加依赖的key
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
 * 将当前激活的副作用添加到dep中
 * @param dep 要添加依赖的dep
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!);
}

/**
 * 从targetMap中找到要触发的依赖并执行
 * @param target 要触发依赖的target
 * @param key    要触发依赖的key
 * @param newValue 新的value
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

  // 先触发所有的计算属性依赖，计算出值
  // 再去触发所有其他依赖，否则会出现死循环的情况
  for (let effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }

  for (let effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler();
  } else {
    effect.run();
  }
}
