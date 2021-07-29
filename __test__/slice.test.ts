import { OnStart, sliceRun } from '../src/slice'
import { delayFn, intRange } from './testUtils'

describe('slice', () => {
  const fn = async <T>(data: T[]) => {
    return delayFn(10, data)()
  }

  it('should work', async () => {
    const source = intRange(100)
    const res = Array(10)
      .fill(null)
      .map((_, i) => intRange(10, i * 10))
    expect(await sliceRun(source, fn, 10)).toStrictEqual(res)

    const source2 = intRange(58)
    expect(await sliceRun(source2, fn, 100)).toStrictEqual([source2])
  })

  it('abortSignal aborted before run', async () => {
    const source = intRange(100)
    const ac = new AbortController()
    ac.abort()
    expect(await sliceRun(source, fn, 10, { signal: ac.signal })).toStrictEqual(
      []
    )
  })

  it('abortSignal', async () => {
    const source = intRange(100)
    const ac = new AbortController()
    setTimeout(() => ac.abort(), 20)
    expect(
      (await sliceRun(source, fn, 10, { signal: ac.signal })).length
    ).toBeLessThan(source.length)
  })

  it('onStart', async () => {
    const tmp: [number, number][] = []
    const onStart: OnStart = (startIndex, endIndex) => {
      tmp.push([startIndex, endIndex])
    }

    const source = intRange(100)
    await sliceRun(source, fn, 10, { onStart })
    const expected = Array(10)
      .fill(null)
      .map((_, i) => [i * 10, i * 10 + 10])

    expect(tmp).toStrictEqual(expected)
  })

  it('onError', async () => {
    const onError = jest.fn()
    const source = intRange(100)
    await sliceRun(
      source,
      (data) => {
        if (data[0] < 50) {
          throw new Error()
        }
      },
      10,
      { onError }
    )
    expect(onError).toBeCalledTimes(5)
  })
})
