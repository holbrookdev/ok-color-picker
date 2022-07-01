export default function debounce(fn: Function, delay = 300, immediate = false) {
  let timeout: number | undefined;
  return function (this: any, ...args: any) {
    function delayed(this: any) {
      timeout = undefined;
      if (!immediate) fn.apply(this, args);
    }
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(delayed, delay);
    if (callNow) fn.apply(this, args);
  };
}
