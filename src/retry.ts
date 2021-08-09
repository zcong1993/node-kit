import { Policy, RetryPolicy, IRetryContext } from 'cockatiel'

const defaultPolicy = Policy.handleAll()
  .retry()
  .attempts(3)
  .exponential({ initialDelay: 1000 })

const noopHandler = () => {}

export class RetryError extends Error {
  constructor(err: Error, readonly retryCtx: IRetryContext) {
    super(err.message)
    this.name = this.constructor.name
  }
}

export type OnError = (err: RetryError) => void

/**
 * run function with cockatiel retry wrapper
 * @param fn
 * @param retryPolicy
 * @param onError
 * @returns
 */
export const runWithRetry = <T = any>(
  fn: () => Promise<T>,
  retryPolicy: RetryPolicy = defaultPolicy,
  onError: OnError = noopHandler
) => {
  return retryPolicy.execute(async (retryCtx) => {
    try {
      return await fn()
    } catch (err) {
      onError(new RetryError(err, retryCtx))
      throw err
    }
  })
}
