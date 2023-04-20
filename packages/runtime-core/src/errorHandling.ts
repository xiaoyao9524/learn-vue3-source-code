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
