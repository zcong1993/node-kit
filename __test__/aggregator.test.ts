import { aggregator, withDefaultValue } from '../src/aggregator'
import { NoopLogger } from '../src/logger'
import { delayFn } from './testUtils'

describe('aggregator', () => {
  const noopLogger = new NoopLogger()

  it('should works', async () => {
    const [res1, res2] = await aggregator(noopLogger, [
      {
        fn: delayFn(100, 1),
        withLog: true,
      },
      {
        fn: () => 'x',
      },
    ])

    expect(res1).toBe(1)
    expect(res2).toBe('x')
  })

  it('fallback', async () => {
    const [res1, res2] = await aggregator(noopLogger, [
      {
        fn: async () => {
          throw new Error('x2')
        },
        fallbackFn: withDefaultValue(1),
        withLog: true,
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

  it('without fallback should throw', async () => {
    await expect(
      aggregator(noopLogger, [
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

  it('fallback throw should throw', async () => {
    await expect(
      aggregator(noopLogger, [
        {
          fn: async () => {
            throw new Error('x2')
          },
          fallbackFn: () => {
            throw new Error('x3')
          },
          withLog: true,
        },
        {
          fn: delayFn(10, 1),
        },
      ])
    ).rejects.toThrow('x3')
  })
})
