import { setTimeout } from 'timers/promises'
import { isAbortError } from '../src'
import {
  aggregator,
  AggregatorError,
  withDefaultValue,
  aggregatorWithAbort,
} from '../src/aggregator'
import { delayFn } from './testUtils'

describe('aggregator', () => {
  it.concurrent('should works', async () => {
    const [res1, res2] = await aggregator([
      {
        fn: delayFn(100, 1),
      },
      {
        fn: () => 'x',
      },
    ])

    expect(res1).toBe(1)
    expect(res2).toBe('x')
  })

  it.concurrent('fallback', async () => {
    const [res1, res2] = await aggregator([
      {
        fn: () => {
          throw new Error('x2')
        },
        fallbackFn: withDefaultValue(1),
      },
      {
        fn: () => {
          throw new Error('x2')
        },
        fallbackFn: withDefaultValue('x'),
      },
    ])

    expect(res1).toBe(1)
    expect(res2).toBe('x')
  })

  it.concurrent('without fallback should throw', async () => {
    await expect(
      aggregator([
        {
          fn: async () => {
            throw new Error('x2')
          },
        },
        {
          fn: delayFn(10, 1),
        },
      ])
    ).rejects.toThrow('x2')
  })

  it.concurrent('fallback throw should throw', async () => {
    await expect(
      aggregator([
        {
          fn: async () => {
            throw new Error('x2')
          },
          fallbackFn: () => {
            throw new Error('x3')
          },
        },
        {
          fn: delayFn(10, 1),
        },
      ])
    ).rejects.toThrow('x3')
  })

  it.concurrent('onError', async () => {
    const onError = vi.fn()
    const [res1, res2] = await aggregator(
      [
        {
          fn: async () => {
            throw new Error('x2')
          },
          fallbackFn: withDefaultValue(1),
        },
        {
          fn: () => {
            throw new Error('x2')
          },
          fallbackFn: withDefaultValue('x'),
        },
      ],
      onError
    )

    expect(res1).toBe(1)
    expect(res2).toBe('x')
    expect(onError).toBeCalledTimes(2)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(AggregatorError)
  })
})

const sleepAbort = (t: number, signal: AbortSignal) =>
  setTimeout(t, null, { signal })

describe('aggregatorWithAbort', () => {
  it.concurrent('should works', async () => {
    const [res1, res2] = await aggregatorWithAbort([
      {
        fn: delayFn(100, 1),
      },
      {
        fn: () => 'x',
      },
    ])

    expect(res1).toBe(1)
    expect(res2).toBe('x')
  })

  it.concurrent('fallback', async () => {
    const [res1, res2] = await aggregatorWithAbort([
      {
        fn: () => {
          throw new Error('x2')
        },
        fallbackFn: withDefaultValue(1),
      },
      {
        fn: () => {
          throw new Error('x2')
        },
        fallbackFn: withDefaultValue('x'),
      },
    ])

    expect(res1).toBe(1)
    expect(res2).toBe('x')
  })

  it.concurrent('without fallback should throw', async () => {
    await expect(
      aggregatorWithAbort([
        {
          fn: async () => {
            throw new Error('x2')
          },
        },
        {
          fn: delayFn(10, 1),
        },
      ])
    ).rejects.toThrow('x2')
  })

  it.concurrent('fallback throw should throw', async () => {
    await expect(
      aggregatorWithAbort([
        {
          fn: async () => {
            throw new Error('x2')
          },
          fallbackFn: () => {
            throw new Error('x3')
          },
        },
        {
          fn: delayFn(10, 1),
        },
      ])
    ).rejects.toThrow('x3')
  })

  it.concurrent('onError', async () => {
    const onError = vi.fn()
    const [res1, res2] = await aggregatorWithAbort(
      [
        {
          fn: async () => {
            throw new Error('x2')
          },
          fallbackFn: withDefaultValue(1),
        },
        {
          fn: () => {
            throw new Error('x2')
          },
          fallbackFn: withDefaultValue('x'),
        },
      ],
      onError
    )

    expect(res1).toBe(1)
    expect(res2).toBe('x')
    expect(onError).toBeCalledTimes(2)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(AggregatorError)
  })

  it.concurrent('test abort', async () => {
    const onError = vi.fn()
    let aborted = false

    await expect(
      aggregatorWithAbort(
        [
          {
            fn: async (signal) => {
              signal.onabort = () => (aborted = true)
              await sleepAbort(200, signal)
              return 1
            },
          },
          {
            fn: async (signal) => {
              await sleepAbort(100, signal)
              throw new Error('x2')
            },
          },
        ],
        onError
      )
    ).rejects.toThrow('x2')

    expect(aborted).toBeTruthy()
  })

  it.concurrent('test abort 2', async () => {
    const onError = vi.fn()
    let aborted = false
    let start: number

    await expect(
      aggregatorWithAbort(
        [
          {
            fn: async (signal) => {
              signal.onabort = () => (aborted = true)
              try {
                start = Date.now()
                await sleepAbort(1000, signal)
              } finally {
                const duration = Date.now() - start
                expect(duration).toBeLessThan(1000)
              }
              return 1
            },
          },
          {
            fn: async (signal) => {
              await sleepAbort(100, signal)
              throw new Error('x3')
            },
            fallbackFn: async () => {
              throw new Error('x2')
            },
          },
        ],
        onError
      )
    ).rejects.toThrow('x2')

    expect(aborted).toBeTruthy()
    expect(onError).toBeCalledTimes(1)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(AggregatorError)
  })

  it.concurrent('test abort 3', async () => {
    const onError = vi.fn()
    const ab = new AbortController()

    global.setTimeout(() => ab.abort(), 100)

    let e: Error

    try {
      await aggregatorWithAbort(
        [
          {
            fn: async (signal) => {
              await sleepAbort(2000, signal)
              return 1
            },
          },
          {
            fn: async (signal) => {
              await sleepAbort(1000, signal)
              return 2
            },
          },
        ],
        onError,
        ab
      )
    } catch (err) {
      e = err
    }

    expect(isAbortError(e)).toBeTruthy()
    expect(onError).toBeCalledTimes(2)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(AggregatorError)
    expect(isAbortError(onError.mock.calls[0][0].err)).toBeTruthy()
    expect(onError.mock.calls[1][0]).toBeInstanceOf(AggregatorError)
    expect(isAbortError(onError.mock.calls[1][0].err)).toBeTruthy()
  })
})
