import { ReactiveEffect } from './effect';
import { Dep } from './dep';
import { trackRefValue, triggerRefValue } from './ref';
import { isFunction, NOOP } from '@vue/shared';

export type ComputedGetter<T> = (...args: any[]) => T;
export type ComputedSetter<T> = (v: T) => void;

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

export type GetterOrComputedOptions<T> =
  | ComputedGetter<T>
  | WritableComputedOptions<T>;

export function computed<T>(getter: ComputedGetter<T>): ComputedRefImpl<T>;
export function computed<T>(
  options: WritableComputedOptions<T>
): ComputedRefImpl<T>;
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
): ComputedRefImpl<T> {
  let getter: ComputedGetter<T>;
  let setter: ComputedSetter<T>;

  const isOnlyGetter = isFunction(getterOrOptions);

  if (isOnlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl<T>(getter, setter);
}

// new ComputedRefImpl().getter;

class ComputedRefImpl<T> {
  public dep?: Dep;
  private _value!: T;
  public readonly _effect!: ReactiveEffect<T>;

  public readonly __v_isRef = true;

  // 如果依赖改变，则此值为true，说明需要更新this._value，否则说明不需要更新，直接返回this._value
  public _dirty: boolean = true;

  constructor(
    getter: ComputedGetter<T>,
    private readonly setter: ComputedSetter<T>
  ) {
    this._effect = new ReactiveEffect(getter, () => {
      // 这个函数会在这个依赖被触发时调用，也就是说自己的依赖被修改了，这里就会被调用
      // 自己的依赖被触发后，说明自己需要被更新了，这里只是将脏置为true，并触发自己的dep
      // 自己的dep被触发后会触发自己的get value，这时脏状态为true，那么会重新执行run函数来计算自己的最新值
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });

    this._effect.computed = this;
  }

  get value() {
    trackRefValue(this);
    if (this._dirty) {
      // 如果此时为脏，那么说明需要重新计算_value
      this._dirty = false; // 即将更新值，将脏赋值为false
      this._value = this._effect.run();
    }

    return this._value;
  }

  set value(newVal: T) {
    this.setter(newVal);
    triggerRefValue(this);
  }
}
