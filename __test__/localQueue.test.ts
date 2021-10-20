import { LocalQueue, LocalQueueError } from '../src/localQueue'
import { delayFn, intRange } from './testUtils'

/* eslint-disable jest/no-done-callback, jest/expect-expect */

describe('LocalQueue', () => {
  it('should works', (done) => {
    const res: any[] = []
    const q = new LocalQueue<number>('test1')

    q.startProcess(async (data, task) => {
      await delayFn(10, null)()
      res.push([data, task])
    }).then(() => {
      const expected = intRange(10).map((x) => [x, { data: x }])
      expect(res).toStrictEqual(expected)
      expect(q.processed).toBe(10)
      done()
    })

    intRange(10).map((x) => q.push(x))
    q.complete()
  })

  it('push before startProcess', (done) => {
    const res: number[] = []
    const q = new LocalQueue<number>('test1')
    q.push(1)

    q.startProcess(async (data) => {
      res.push(data)
    }).then(() => {
      expect(res).toStrictEqual([1, ...intRange(10)])
      done()
    })

    intRange(10).map((x) => q.push(x))
    q.complete()
  })

  it('complete before startProcess will process nothing', (done) => {
    const res: number[] = []
    const q = new LocalQueue<number>('test1')
    q.push(1)
    q.push(2)
    q.complete()

    q.startProcess(async (data) => {
      res.push(data)
    }).then(() => {
      expect(res).toStrictEqual([])
      done()
    })

    intRange(10).map((x) => q.push(x))
  })

  it('onError', (done) => {
    const onError = jest.fn()
    const q = new LocalQueue<number>('test1', 10, onError)
    q.startProcess(async (data) => {
      if (data < 5) {
        throw new Error()
      }
      await delayFn(10, null)()
    }).then(() => {
      expect(onError).toBeCalledTimes(5)
      expect(onError.mock.calls[0][0]).toBeInstanceOf(LocalQueueError)
      done()
    })

    intRange(10).map((x) => q.push(x))
    q.complete()
  })

  it('concurrent', (done) => {
    const q = new LocalQueue<number>('test1', 2)
    q.startProcess(async () => {
      await delayFn(10, null)()
    }).then(done)

    intRange(10).map((x) => q.push(x))
    q.complete()
  })
})
