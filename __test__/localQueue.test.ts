import { LocalQueue, LocalQueueError } from '../src/localQueue'
import { delayFn, intRange } from './testUtils'

describe('LocalQueue', () => {
  it('should works', async () => {
    const res: any[] = []
    const q = new LocalQueue<number>('test1')

    await new Promise((r) => {
      q.startProcess(async (data, task) => {
        await delayFn(10, null)()
        res.push([data, task])
      }).then(() => {
        const expected = intRange(10).map((x) => [x, { data: x }])
        expect(res).toStrictEqual(expected)
        expect(q.processed).toBe(10)
        r(null)
      })

      intRange(10).map((x) => q.push(x))
      q.complete()
    })
  })

  it('push before startProcess', async () => {
    const res: number[] = []
    const q = new LocalQueue<number>('test1')
    q.push(1)

    await new Promise((r) => {
      q.startProcess(async (data) => {
        res.push(data)
      }).then(() => {
        expect(res).toStrictEqual([1, ...intRange(10)])
        r(null)
      })

      intRange(10).map((x) => q.push(x))
      q.complete()
    })
  })

  it('complete before startProcess will process nothing', async () => {
    const res: number[] = []
    const q = new LocalQueue<number>('test1')

    await new Promise((r) => {
      q.push(1)
      q.push(2)
      q.complete()

      q.startProcess(async (data) => {
        res.push(data)
      }).then(() => {
        expect(res).toStrictEqual([])
        r(null)
      })

      intRange(10).map((x) => q.push(x))
    })
  })

  it('onError', async () => {
    const onError = vi.fn()
    const q = new LocalQueue<number>('test1', 10, onError)
    await new Promise((r) => {
      q.startProcess(async (data) => {
        if (data < 5) {
          throw new Error()
        }
        await delayFn(10, null)()
      }).then(() => {
        expect(onError).toBeCalledTimes(5)
        expect(onError.mock.calls[0][0]).toBeInstanceOf(LocalQueueError)
        r(null)
      })

      intRange(10).map((x) => q.push(x))
      q.complete()
    })
  })

  it('concurrent', async () => {
    const q = new LocalQueue<number>('test1', 2)
    await new Promise((r) => {
      q.startProcess(async () => {
        await delayFn(10, null)()
      }).then(() => r(null))

      intRange(10).map((x) => q.push(x))
      q.complete()
    })
  })
})
