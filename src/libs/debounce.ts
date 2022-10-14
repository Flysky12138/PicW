const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let settimeout: NodeJS.Timeout | undefined

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(settimeout)
    return new Promise<ReturnType<T>>(resolve => {
      settimeout = setTimeout(() => {
        resolve(fn.apply(this, args))
      }, delay)
    })
  }
}

export default debounce
