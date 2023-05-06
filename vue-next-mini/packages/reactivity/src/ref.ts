import { Dep, createDep } from './dep';
import { toReactive } from './reactive';
import { trackEffects, activeEffect, triggerEffects } from './effect';
import { hasChanged } from '@vue/shared';

export interface Ref<T = any> {
  value: T;
}

export function ref(value?: unknown) {
  return createRef(value, false);
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue;
  }

  return new RefImpl(rawValue, shallow);
}

class RefImpl<T> {
  private _value: T; // 经过处理后get value返回的值(基础类型就是原样返回，对象返回reactive后的实例)

  private _rawValue: T; // 原始值，可以理解为ref传进来的参数

  public dep?: Dep = undefined;

  public readonly __v_isRef = true;

  constructor(value: T, public __v_shallow: boolean) {
    this._rawValue = value;
    this._value = this.__v_shallow ? value : toReactive(value);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = toReactive(newVal);

      triggerRefValue(this);
    }
  }
}

/**
 * 将当前激活的副作用添加到 ref类型的实例 dep中
 * @param ref 要收集依赖的ref实例
 */
export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()));
  }
}

/**
 * 触发 ref类型实例 的dep
 * @param ref 要触发依赖的ref实例
 */
export function triggerRefValue(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep);
  }
}

// 判断是否为ref类型的实例
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true);
}
