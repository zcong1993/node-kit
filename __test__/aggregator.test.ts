import {
  aggregator,
  AggregatorError,
  withDefaultValue,
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
    const onError = jest.fn()
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
