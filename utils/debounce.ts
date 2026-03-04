export function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
  ){
    let timerId: ReturnType<typeof setTimeout>;
    return function(this: ThisParameterType<T>, ...args: any[]){
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback.apply(this, args);
        }, delay)
    }
}