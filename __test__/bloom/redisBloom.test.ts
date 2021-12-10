import {
  estimateParameters,
  RedisBloom,
  RedisBitSet,
} from '../../src/bloom/redisBloom'
import { setupRedis } from '../testUtils'

let redis: any
let close: Function

beforeAll(async () => {
  ;[redis, close] = setupRedis()
  await redis.flushdb()
})

afterAll(() => {
  close()
}, 10000)

describe('RedisBloom', () => {
  it('should works', async () => {
    const rb = new RedisBloom(redis, 'test1', 64, 10)
    expect(await rb.check('key1')).toBeFalsy()
    await rb.add('key1')
    await rb.add(Buffer.from('key2'))
    expect(await rb.check('key1')).toBeTruthy()
    expect(await rb.check('key2')).toBeTruthy()
    expect(await rb.check(Buffer.from('key1'))).toBeTruthy()
  })

  it('newWithEstimates', async () => {
    const rb = RedisBloom.newWithEstimates(redis, 'test2', 1000, 0.0001)
    expect(await rb.check('key1')).toBeFalsy()
    await rb.add('key1')
    await rb.add(Buffer.from('key2'))
    expect(await rb.check('key1')).toBeTruthy()
    expect(await rb.check('key2')).toBeTruthy()
    expect(await rb.check(Buffer.from('key1'))).toBeTruthy()
  })
})

describe('RedisBitSet', () => {
  it('should throw too large offset error', async () => {
    const rbs = new RedisBitSet(redis, 'testbs1', 10)
    await expect(() => rbs.set([10])).rejects.toThrow()
  })

  it('should works', async () => {
    const rbs = new RedisBitSet(redis, 'testbs2', 1000)
    const offsets = [1, 2, 993]
    expect(await rbs.check(offsets)).toBeFalsy()
    await rbs.set(offsets)
    expect(await rbs.check(offsets)).toBeTruthy()
    expect(await rbs.check(offsets.slice(0, 2))).toBeTruthy()
  })
})

describe('estimateParameters', () => {
  it('should works', () => {
    expect(estimateParameters(1000, 0.0001)).toStrictEqual([19171, 14])
    expect(estimateParameters(10000, 0.0001)).toStrictEqual([191702, 14])
    expect(estimateParameters(100000, 0.001)).toStrictEqual([1437759, 10])
  })
})
