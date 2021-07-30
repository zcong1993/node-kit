import { LocalQueue } from '../src/localQueue'
import { delayFn, intRange } from './testUtils'

describe('LocalQueue', () => {
  it('should works', async () => {
    const res: any[] = []
    const q = new LocalQueue<number>('test1')
    q.startProcess(async (data, task) => {
      await delayFn(10, null)()
      res.push([data, task])
    }).then(() => {
      const expected = intRange(10).map((x) => [x, { data: x }])
      expect(res).toStrictEqual(expected)
      expect(q.processed).toBe(10)
    })
    intRange(10).map((x) => q.push(x))
    q.complete()
  })

  it('push before startProcess should throw', () => {
    const q = new LocalQueue<number>('test1')
    expect(() => q.push(1)).toThrow()
  })

  it('onError', async () => {
    let i = 0
    const onError = () => i++
    const q = new LocalQueue<number>('test1', 10, onError)
    q.startProcess(async (data) => {
      if (data < 5) {
        throw new Error()
      }
      await delayFn(10, null)()
    }).then(() => {
      expect(i).toBe(5)
    })

    intRange(10).map((x) => q.push(x))
    q.complete()
  })

  it('concurrent', async () => {
    const q = new LocalQueue<number>('test1', 2)
    q.startProcess(async () => {
      await delayFn(10, null)()
    })

    intRange(10).map((x) => q.push(x))
    q.complete()
  })
})
