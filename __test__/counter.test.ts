import type Redis from 'ioredis'
import { Counter } from '../src/counter'
import { setupRedis } from './testUtils'

let redis: Redis
let close: Function

describe('Counter', () => {
  beforeAll(async () => {
    ;[redis, close] = setupRedis()
  })

  beforeEach(async () => {
    await redis.flushdb()
  })

  afterAll(() => {
    close()
  }, 10000)

  it('basic usage', async () => {
    const tc = new Counter(redis, 'test-1')
    const testKey1 = 'test1'
    const testKey2 = 'test2'
    expect(await tc.exists(testKey1)).toBeFalsy()
    expect(await tc.getOne(testKey1)).toBe(0)
    expect(await tc.getOne(testKey1, 11)).toBe(11)
    await tc.incr(testKey1, 2)
    expect(await tc.getOne(testKey1)).toBe(2)
    expect(await tc.exists(testKey1)).toBeTruthy()
    expect(await tc.getAll()).toStrictEqual({ [testKey1]: '2' })

    await tc.incr(testKey2, 3)
    expect(await tc.getOne(testKey2)).toBe(3)
    expect(await tc.getAll()).toStrictEqual({
      [testKey1]: '2',
      [testKey2]: '3',
    })

    await tc.set(testKey2, 200)
    expect(await tc.getOne(testKey2)).toBe(200)

    await tc.delete(testKey1)
    expect(await tc.exists(testKey1)).toBeFalsy()
    expect(await tc.getAll()).toStrictEqual({ [testKey2]: '200' })
  })

  it('incr or set', async () => {
    const tc = new Counter(redis, 'test-2')
    const testKey1 = 'test1'

    await tc.incrOrSet(testKey1, 2, 10)
    expect(await tc.getOne(testKey1)).toBe(12)
    await tc.incrOrSet(testKey1, 3, 10)
    expect(await tc.getOne(testKey1)).toBe(15)
    await tc.delete(testKey1)

    const fn = vi.fn().mockImplementation().mockResolvedValue(20)
    await tc.incrOrSetLazyload(testKey1, 2, fn)
    expect(await tc.getOne(testKey1)).toBe(22)
    expect(fn).toBeCalledTimes(1)
    await tc.incrOrSetLazyload(testKey1, 3, fn)
    expect(await tc.getOne(testKey1)).toBe(25)
    expect(fn).toBeCalledTimes(1)
  })

  it('mergeTo getAndMergeTo', async () => {
    const tc = new Counter(redis, 'test-3')
    const testKey1 = 'test1'
    const testKey2 = 'test2'

    await tc.set(testKey1, 100)
    await tc.set(testKey2, 200)

    const records = [
      {
        id: testKey1,
        name: 'name',
      },
      {
        id: testKey2,
        name: 'name',
        count: 99, // field already exists
      },
      {
        id: 'testKey3', // counter key not exists
        name: 'name',
      },
    ]
    const records2 = records
    const records3 = records
    const counters = await tc.getAll()

    tc.mergeTo(records, counters, 'count', (r) => r.id)
    expect(records).toStrictEqual([
      {
        id: testKey1,
        name: 'name',
        count: 100,
      },
      {
        id: testKey2,
        name: 'name',
        count: 200,
      },
      {
        id: 'testKey3',
        name: 'name',
        count: 0,
      },
    ])

    await tc.getAndMergeTo(records2, 'count', (r) => r.id)

    expect(records2).toStrictEqual([
      {
        id: testKey1,
        name: 'name',
        count: 100,
      },
      {
        id: testKey2,
        name: 'name',
        count: 200,
      },
      {
        id: 'testKey3',
        name: 'name',
        count: 0,
      },
    ])

    // with defaultValue
    await tc.getAndMergeTo(records3, 'count', (r) => r.id, 10)

    expect(records3).toStrictEqual([
      {
        id: testKey1,
        name: 'name',
        count: 100,
      },
      {
        id: testKey2,
        name: 'name',
        count: 200,
      },
      {
        id: 'testKey3',
        name: 'name',
        count: 10,
      },
    ])
  })
})
