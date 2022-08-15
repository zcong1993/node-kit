import {
  IExponentialBackoffOptions,
  IRetryContext,
  RetryPolicy,
  handleAll,
  retry,
  ExponentialBackoff,
} from 'cockatiel'

const defaultPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff({
    initialDelay: 1000,
  }),
})

export const createSimpleRetryPolicy = (
  maxAttempts: number,
  exponentialOptions?: Partial<IExponentialBackoffOptions<unknown>>
) =>
  retry(handleAll, {
    maxAttempts,
    backoff: new ExponentialBackoff(exponentialOptions),
  })

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
 * @param fn - run function
 * @param retryPolicy - cockatiel retry policy
 * @param onError - error listener
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
