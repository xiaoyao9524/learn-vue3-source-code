let isFlushPending = false;
let isFlushing = false;

export let pendingPreFlushCbs: Function[] = [];
export let activePreFlushCbs: Function[] | null = null;
export let preFlushIndex = 0;

const resolvedPromise = Promise.resolve() as Promise<any>;
let currentFlushPromise: Promise<void> | null = null;

export function queuePreFlushCb(cb: () => any) {
  queueCb(cb, pendingPreFlushCbs);
}

/**
 * 将cb函数添加到pending队列中
 * @param cb 要添加的函数
 * @param pendingQueue pending队列
 */
function queueCb(cb: () => any, pendingQueue: Function[]) {
  pendingQueue.push(cb);

  queueFlush();
}

/**
 * 在一次微任务后开始执行队列中的函数
 */
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

/**
 * 修改队列状态并依次执行队列中的函数
 */
function flushJobs() {
  isFlushPending = false;
  isFlushing = true;

  flushPreFlushCbs();

  isFlushing = false;
  currentFlushPromise = null;
}

/**
 * 循环依次执行队列中的函数
 */
function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length) {
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;

    for (
      preFlushIndex = 0;
      preFlushIndex < activePreFlushCbs.length;
      preFlushIndex++
    ) {
      activePreFlushCbs[preFlushIndex]();
    }

    activePreFlushCbs = null;
    preFlushIndex = 0;

    flushPreFlushCbs();
  }
}
