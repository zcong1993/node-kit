import { Policy } from 'cockatiel'
import { RetryError, runWithRetry } from '../src/retry'
import { delayFn } from './testUtils'

describe('retry', () => {
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

    const testPolicy = Policy.handleAll()
      .retry()
      .attempts(3)
      .delay([10, 20, 30])
    expect(await runWithRetry(fn, testPolicy)).toBe(1)

    i = 0
    await expect(
      runWithRetry(fn, Policy.handleAll().retry().attempts(1).delay([10]))
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

    const f = jest.fn()

    await runWithRetry(fn, Policy.handleAll().retry().delay([10, 20, 30]), f)

    expect(f).toBeCalledTimes(2)
    expect(f.mock.calls[0][0]).toBeInstanceOf(RetryError)
  })
})
