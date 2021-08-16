import { Cacher, RedisCache } from '@zcong/node-redis-cache'
import { cache } from '../src/cache'
import { repeatCall, setupRedis, sleep } from './testUtils'

let redis: any
let close: Function
let cacher: Cacher

describe('cache', () => {
  beforeAll(async () => {
    ;[redis, close] = setupRedis()
    await redis.flushdb()
    cacher = new RedisCache({
      redis,
      prefix: 'cache',
    })
  })

  afterAll(() => {
    close()
  }, 10000)

  it('should works', async () => {
    const mockRes = { age: 1 }

    class Test {
      @cache(cacher, {
        keyPrefix: 'cacheTest',
        expire: 10,
      })
      async cacheTest() {
        await sleep(100)
        this.mockFn()
        return mockRes
      }

      mockFn() {
        return true
      }
    }

    const test = new Test()
    const spy = jest.spyOn(test, 'mockFn')

    await repeatCall(10, async () => {
      expect(await test.cacheTest()).toStrictEqual(mockRes)
    })

    expect(spy).toBeCalledTimes(1)
  })

  it('with params', async () => {
    class Test {
      @cache(cacher, {
        keyPrefix: 'cacheTest2',
        expire: 10,
      })
      async cacheTest(name: string, age: number) {
        await sleep(100)
        return this.mockFn(name, age)
      }

      mockFn(name: string, age: number) {
        return { name, age }
      }
    }

    const test = new Test()
    const spy = jest.spyOn(test, 'mockFn')

    await repeatCall(10, async () => {
      expect(await test.cacheTest('zc', 18)).toStrictEqual({
        name: 'zc',
        age: 18,
      })
    })
    expect(spy).toBeCalledTimes(1)

    await repeatCall(10, async () => {
      expect(await test.cacheTest('zc1', 18)).toStrictEqual({
        name: 'zc1',
        age: 18,
      })
    })
    expect(spy).toBeCalledTimes(2)
  })
})
