import { handleAll, IterableBackoff, retry, RetryPolicy } from 'cockatiel'
import { RetryError, runWithRetry, createSimpleRetryPolicy } from '../src/retry'
import { delayFn } from './testUtils'

describe('retry', () => {
  it('createSimpleRetryPolicy', () => {
    expect(createSimpleRetryPolicy(3)).toBeInstanceOf(RetryPolicy)
    expect(createSimpleRetryPolicy(3, { initialDelay: 3000 })).toBeInstanceOf(
      RetryPolicy
    )
  })

  it('should work', async () => {
    let i = 0
    const fn = async () => {
      if (i < 2) {
        i++
        throw new Error()
      }
      return delayFn(100, 1)()
    }

    expect(await runWithRetry(fn)).toBe(1)
  })

  it('test policy', async () => {
    let i = 0
    const fn = async () => {
      if (i < 2) {
        i++
        throw new Error()
      }
      return delayFn(100, 1)()
    }

    const testPolicy = retry(handleAll, {
      maxAttempts: 3,
      backoff: new IterableBackoff([10, 20, 30]),
    })

    expect(await runWithRetry(fn, testPolicy)).toBe(1)

    i = 0
    await expect(
      runWithRetry(
        fn,
        retry(handleAll, {
          maxAttempts: 1,
          backoff: new IterableBackoff([10]),
        })
      )
    ).rejects.toThrow()
  })

  it('test onError', async () => {
    let i = 0
    const fn = async () => {
      if (i < 2) {
        i++
        throw new Error()
      }
      return delayFn(100, 1)()
    }

    const f = vi.fn()

    await runWithRetry(
      fn,
      retry(handleAll, {
        maxAttempts: 3,
        backoff: new IterableBackoff([10, 20, 30]),
      }),
      f
    )

    expect(f).toBeCalledTimes(2)
    expect(f.mock.calls[0][0]).toBeInstanceOf(RetryError)
  })
})
