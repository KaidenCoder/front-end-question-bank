export function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
  ) {
    let timerId: ReturnType<typeof setTimeout>;
  
    function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timerId);
  
      timerId = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    }

    debounced.cancel = () => {
      clearTimeout(timerId);
    };
  
    return debounced as T & { cancel: () => void };
  }