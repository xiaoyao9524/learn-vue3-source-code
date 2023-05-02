import { isArray, isString, camelize } from '@vue/shared';

type Style = string | Record<string, string | string[]> | null;

export function patchStyle(el: Element, prev: Style, next: Style) {
  const style = (el as HTMLElement).style;

  const isCssString = isString(next);

  if (next && !isCssString) {
    for (let key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;

    // 如果传入的style是字符串的话，直接赋值给style.cssText
    if (isCssString) {
      style.cssText = next;
    } else if (prev) {
      // 能进到这里说明next没有值
      // (next && !isCssString)说明next存在并且不是字符串，
      // 上面的if又排除了next是字符串，所以剩下只能是null了
      // 加上prev有值的话说明之前存在style这个attr，需要移除
      el.removeAttribute('style');
    }

    /**
     * 表示元素的"display"由"v-show"控制，
     * 所以我们总是保持当前的display值不管style是什么值，
     * 从而将控制权交给"v-show"。
     */
    if ('_vod' in el) {
      style.display = currentDisplay;
    }
  }
}

function setStyle(
  style: CSSStyleDeclaration,
  name: string,
  val: string | string[]
) {
  if (isArray(val)) {
    val.forEach(v => setStyle(style, name, v));
  } else {
    if (val === null) {
      val = '';
    }

    // 处理自定义属性
    if (val.startsWith('--')) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);

      // 此处还应该处理 !important 的情况

      style[prefixed as any] = val;
    }
  }
}

const prefixes = ['Webkit', 'Moz', 'ms'];
const prefixCache: Record<string, string> = {};

/**
 * 处理style的key，例如将类似font-size转换成大驼峰
 * 内部有一个缓存对象，如果处理过的key将会缓存，下次直接返回
 * @param style element.style对象
 * @param rawName 未经过处理的style名称
 * @returns void
 */
function autoPrefix(style: CSSStyleDeclaration, rawName: string) {
  const cached = prefixCache[rawName];

  if (cached) {
    return cached;
  }

  let name = camelize(rawName);

  if (name !== 'filter' && name in style) {
    return (prefixCache[rawName] = name);
  }

  // 下面这段暂时不知道是处理什么情况的
  name = camelize(name);

  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;

    if (prefixed in style) {
      return (cached[rawName] = prefixed);
    }
  }

  return rawName;
}
