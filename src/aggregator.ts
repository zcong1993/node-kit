import { isAbortError } from './utils'

const r = Promise.resolve()

/**
 * Handler function for {@link Handler} fn and fallbackFn
 *
 * @public
 */
export type HandlerFunc<T> = (signal?: AbortSignal) => Awaited<T> | T

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
  constructor(readonly err: Error, readonly index: number) {
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
  const res = await Promise.all(
    iterable.map(async (it, i) => {
      return r
        .then(() => it.fn())
        .catch((err) => {
          if (onError) {
            onError(new AggregatorError(err, i))
          }

          if (!it.fallbackFn) {
            throw err
          }
          return it.fallbackFn()
        })
    })
  )

  return res as any as Promise<ResultTuple<T>>
}

export const aggregatorWithAbort = async <T extends [unknown, ...unknown[]]>(
  iterable: HandlerTuple<T>,
  onError?: AggregatorOnError,
  abortController?: AbortController
): Promise<ResultTuple<T>> => {
  const ac = abortController ?? new AbortController()

  const res = await Promise.all(
    iterable.map(async (it, i) => {
      return r
        .then(() => it.fn(ac.signal))
        .catch((err) => {
          if (onError) {
            onError(new AggregatorError(err, i))
          }

          if (!it.fallbackFn || isAbortError(err)) {
            throw err
          }

          return it.fallbackFn(ac.signal)
        })
    })
  ).catch((err) => {
    ac.abort()
    throw err
  })

  return res as any as Promise<ResultTuple<T>>
}
