import allsettled from 'promise.allsettled'

/**
 * Handler function for {@link Handler} fn and fallbackFn
 *
 * @public
 */
export type HandlerFunc<T> = () => Promise<T> | T

/**
 * Args type for {@link aggregator}
 *
 * @public
 */
export interface Handler<T> {
  fn: HandlerFunc<T>
  fallbackFn?: HandlerFunc<T>
}

/**
 * Helper type for infer handlers
 *
 * @public
 */
export type HandlerTuple<T extends [unknown, ...unknown[]]> = {
  [P in keyof T]: Handler<T[P]>
}

/**
 * Helper type for aggregator result
 *
 * @public
 */
export type ResultTuple<T extends [unknown, ...unknown[]]> = {
  [P in keyof T]: T[P]
}

/**
 * AggregatorError extends Error with index, for {@link AggregatorOnError}
 *
 * @public
 */
export class AggregatorError extends Error {
  constructor(err: Error, readonly index: number) {
    super(err.message)
    this.name = this.constructor.name
  }
}

/**
 * AggregatorOnError type of error handler
 *
 * @public
 */
export type AggregatorOnError = (error: AggregatorError) => void

/**
 * Create a fallbackFn with a static default value
 * @param value - default value
 * @returns fallbackFn {@link HandlerFunc}
 *
 * @public
 */
export const withDefaultValue = <T>(value: T): HandlerFunc<T> => {
  return (): T => value
}

/**
 * aggregate many promise in concurency
 * support fallback
 * @remarks
 * call all handler.fn concurrency, if one handler throw error without fallbackFn or fallbackFn throw error
 * aggregator will throw the error
 * @public
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
