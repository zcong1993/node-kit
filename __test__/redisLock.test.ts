import { tryLock, runWithMutex } from '../src/redisLock'
import { repeatCall, setupRedis, sleep } from './testUtils'

let redis: any
let close: Function

describe('redisLock', () => {
  beforeAll(async () => {
    ;[redis, close] = setupRedis()
    await redis.flushdb()
  })

  afterAll(() => {
    close()
  }, 10000)

  it('tryLock', async () => {
    const testKey = 'testKey'
    const res = await repeatCall(10, async () => tryLock(redis, testKey, 10000))

    expect(res.filter((r) => r[0]).length).toBe(1)
    expect(await redis.dbsize()).toBe(1)
    await res.filter((r) => r[0])[0][1]()
    expect(await redis.dbsize()).toBe(0)
  })

  it('runWithMutex', async () => {
    const testKey = 'testKey'
    const fn = jest.fn()
    await repeatCall(10, () => runWithMutex(redis, testKey, fn, 10000))
    expect(fn).toBeCalledTimes(1)
    expect(await redis.dbsize()).toBe(0)
  })

  it('runWithMutex throw', async () => {
    const testKey = 'testKey'
    const fn = jest.fn().mockImplementation(async () => {
      throw new Error()
    })

    await repeatCall(10, () =>
      runWithMutex(redis, testKey, fn, 10000).catch(() => {})
    )
    expect(fn).toBeCalledTimes(1)
    expect(await redis.dbsize()).toBe(0)
  })

  it('not delete other lock', async () => {
    const testKey = 'testKey'
    const [ok, freeFn] = await tryLock(redis, testKey, 500)
    expect(ok).toBeTruthy()
    // wait key expired
    await sleep(600)
    // instance2 get lock
    const [ok2, freeFn2] = await tryLock(redis, testKey, 5000)
    expect(ok2).toBeTruthy()
    // freeFn should not free instance2's lock
    await freeFn()
    expect(await redis.dbsize()).toBe(1)
    // freeFn2 can free instance2's lock
    await freeFn2()
    expect(await redis.dbsize()).toBe(0)
  })
})
