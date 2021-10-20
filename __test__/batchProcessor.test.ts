import { setTimeout } from 'timers/promises'
import { BatchProcessor } from '../src/batchProcessor'
import { intRange } from './testUtils'

const createRecorder = (): [number[][], (tasks: number[]) => Promise<void>] => {
  const arr: number[][] = []
  return [
    arr,
    async (tasks: number[]) => {
      await setTimeout(10)
      arr.push(tasks)
    },
  ]
}

describe('forceDelay mode', () => {
  it('should works well', async () => {
    const [res, fn] = createRecorder()
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 2,
      scheduledDelayMs: 100,
      forceDelay: true,
    })
    intRange(9).forEach((i) => bp.add(i))
    await setTimeout(600)
    expect(res.length).toBe(5)
    expect(res).toStrictEqual([[0, 1], [2, 3], [4, 5], [6, 7], [8]])
  })

  it('queued tasks less than maxBatchSize shoule handle', async () => {
    const [res, fn] = createRecorder()
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 200,
      scheduledDelayMs: 100,
      forceDelay: true,
    })
    intRange(10).forEach((i) => bp.add(i))
    await setTimeout(200)
    expect(res).toStrictEqual([intRange(10)])
  })

  it('shoule not handle until scheduledDelayMs', async () => {
    const [res, fn] = createRecorder()
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 10,
      scheduledDelayMs: 100,
      forceDelay: true,
    })
    intRange(10).forEach((i) => bp.add(i))
    expect(res.length).toBe(0)
    await setTimeout(200)
    expect(res).toStrictEqual([intRange(10)])
  })

  it('forceFlush', async () => {
    const [res, fn] = createRecorder()
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 2,
      scheduledDelayMs: 1000,
      forceDelay: true,
    })
    intRange(10).forEach((i) => bp.add(i))
    expect(res.length).toBe(0)
    await bp.forceFlush()
    expect(res).toStrictEqual([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ])
  })

  it('shutdown', async () => {
    const [res, fn] = createRecorder()
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 2,
      scheduledDelayMs: 1000,
      forceDelay: true,
    })
    intRange(10).forEach((i) => bp.add(i))
    expect(res.length).toBe(0)
    await bp.shutdown()
    expect(res).toStrictEqual([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ])
    intRange(10).forEach((i) => bp.add(i))
    await bp.forceFlush()
    expect(res).toStrictEqual([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ])
    await bp.shutdown()
    expect(res).toStrictEqual([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ])
  })

  it('error handler', async () => {
    const fn = async (_tasks: number[]) => {
      throw new Error()
    }
    const errs: Error[] = []
    const onError = (err: Error) => errs.push(err)
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 200,
      scheduledDelayMs: 100,
      forceDelay: true,
      onError,
    })
    intRange(10).forEach((i) => bp.add(i))
    await setTimeout(200)
    expect(errs.length).toBe(1)
  })

  it('empty tasks', async () => {
    const [res, fn] = createRecorder()
    new BatchProcessor(fn, {
      maxBatchSize: 200,
      scheduledDelayMs: 100,
      forceDelay: true,
    })
    await setTimeout(200)
    expect(res.length).toBe(0)
  })
})

describe('no forceDelay mode', () => {
  it('queued tasks more than maxBatchSize', async () => {
    const [res, fn] = createRecorder()
    const bp = new BatchProcessor(fn, {
      maxBatchSize: 2,
      scheduledDelayMs: 1000,
    })
    intRange(10).forEach((i) => bp.add(i))
    await setTimeout(100)
    expect(res).toStrictEqual([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ])
  })
})
