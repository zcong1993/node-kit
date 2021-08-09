import allsettled from 'promise.allsettled'

export const withDefaultValue = <T>(value: T) => {
  return (): T => value
}

export class AggregatorError extends Error {
  constructor(err: Error, readonly index: number) {
    super(err.message)
    this.name = this.constructor.name
  }
}

export type AggregatorOnError = (error: AggregatorError) => void

/**
 * aggregate many promise into array
 * support fallback
 * @param iterable
 * @param onError
 * @returns
 */
export const aggregator = async <T extends [unknown, ...unknown[]]>(
  iterable: HandlerTuple<T>,
  onError?: AggregatorOnError
): Promise<ResultTuple<T>> => {
  // https://github.com/es-shims/Promise.allSettled/issues/5#issuecomment-747464536
  const resArr = await allsettled.call(
    Promise,
    iterable.map(async (it, i) => {
      if (!it.fallbackFn) {
        return it.fn()
      }

      try {
        return await it.fn()
      } catch (err) {
        if (onError) {
          onError(new AggregatorError(err, i))
        }
        return it.fallbackFn()
      }
    })
  )
  const res = []
  for (let i = 0; i < resArr.length; i++) {
    const r = resArr[i]
    if (r.status === 'fulfilled') {
      res.push(r.value)
    } else {
      throw new Error(r.reason as any)
    }
  }
  return res as any as Promise<ResultTuple<T>>
}

export interface Handler<T> {
  fn: () => Promise<T> | T
  fallbackFn?: () => Promise<T> | T
}

export type HandlerTuple<T extends [unknown, ...unknown[]]> = {
  [P in keyof T]: Handler<T[P]>
}
export type ResultTuple<T extends [unknown, ...unknown[]]> = {
  [P in keyof T]: T[P]
}
