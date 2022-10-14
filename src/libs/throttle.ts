const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let valid = -1

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (valid == -1 || Date.now() - valid >= delay) {
      const ans = fn.apply(this, args)
      valid = Date.now()
      return ans
    }
  }
}

export default throttle
