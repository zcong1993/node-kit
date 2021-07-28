import { LoggerService } from '@nestjs/common'
import allsettled from 'promise.allsettled'

export interface Handler<T> {
  fn: () => Promise<T> | T
  fallbackFn?: () => Promise<T> | T
  withLog?: boolean
}

export type HandlerTuple<T extends [unknown, ...unknown[]]> = {
  [P in keyof T]: Handler<T[P]>
}
export type ResultTuple<T extends [unknown, ...unknown[]]> = {
  [P in keyof T]: T[P]
}

export const withDefaultValue = <T>(value: T) => {
  return (): T => value
}

export const aggregator = async <T extends [unknown, ...unknown[]]>(
  logger: LoggerService,
  iterable: HandlerTuple<T>
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
        if (it.withLog) {
          const logContent = `index ${i} call origin fn error: ${err}, will call fallbackFn`
          logger.warn(logContent)
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
      if (iterable[i].withLog) {
        const logContent = `index ${i} cause error, will throw: ${r.reason}`
        logger.warn(logContent)
      }
      throw new Error(r.reason as any)
    }
  }
  return res as any as Promise<ResultTuple<T>>
}
