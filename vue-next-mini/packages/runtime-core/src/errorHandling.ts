/**
 * 安全地执行传入的fn函数
 * @param fn 要执行的函数
 * @param args 函数的参数
 * @returns fn返回值
 */
export function callWithAsyncErrorHandling(fn: Function, args?: unknown[]) {
  let res;

  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err);
  }

  return res;
}

export function handleError(err: unknown) {
  logError(err);
}

function logError(err: unknown) {
  console.warn('出错了：', err);
}
