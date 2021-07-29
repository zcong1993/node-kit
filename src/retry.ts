import { Policy, RetryPolicy, IRetryContext } from 'cockatiel'

const defaultPolicy = Policy.handleAll()
  .retry()
  .attempts(3)
  .exponential({ initialDelay: 1000 })

const noopHandler = () => {}

export type OnError = (err: Error, retryCtx: IRetryContext) => void

export const runWithRetry = <T = any>(
  fn: () => Promise<T>,
  retryPolicy: RetryPolicy = defaultPolicy,
  onError: OnError = noopHandler
) => {
  return retryPolicy.execute(async (retryCtx) => {
    try {
      return await fn()
    } catch (err) {
      onError(err, retryCtx)
      throw err
    }
  })
}
