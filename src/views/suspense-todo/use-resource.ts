const wrapResource = <T>(promise: Promise<T>) => {
  let result: T | Error | null = null
  promise.then(
    (_result) => {
      result = _result
    },
    (err: Error) => {
      result = err
    }
  )

  return () => {
    if (result === null) {
      throw promise
    }
    if (result instanceof Error) {
      throw result
    }
    return result
  }
}

const useResource = wrapResource(new Promise(resolve => {
  setTimeout(() => {
    try {
      resolve(JSON.parse(window.localStorage.getItem('zustand-todo') || '[]'))
    } catch (e) {
      resolve([])
    }
  }, 3000)
}))

export default useResource
