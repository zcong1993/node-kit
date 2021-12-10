import type { Redis } from 'ioredis'
import { loadPackage } from '../loadPackage'
import { objOnceGuard } from '../utils'

export const estimateParameters = (
  n: number,
  p: number
): [m: number, k: number] => {
  const m = Math.floor(
    Math.ceil((-1 * n * Math.log(p)) / Math.pow(Math.log(2), 2))
  )
  const k = Math.floor(Math.ceil((Math.log(2) * m) / n))
  return [m, k]
}

// from go-zero and bits-and-blooms/bloom projects
// https://github.com/zeromicro/go-zero/blob/07191dc430f43a362f1030e1d1d871e6d8227ab8/core/bloom/bloom.go
// https://github.com/bits-and-blooms/bloom
export class RedisBloom {
  private readonly murmur32: any
  private readonly redisBitSet: RedisBitSet

  constructor(
    redis: Redis,
    readonly key: string,
    readonly m: number,
    readonly k: number
  ) {
    this.murmur32 = loadPackage('imurmurhash', 'RedisBloom')
    this.redisBitSet = new RedisBitSet(redis, key, m)
  }

  /**
   * NewWithEstimates creates a new Bloom filter for about n items
   * with fp false positive rate
   * https://github.com/bits-and-blooms/bloom
   * @param n - n items
   * @param fp - false positive rate
   * @returns
   */
  static newWithEstimates(redis: Redis, key: string, n: number, fp: number) {
    const [m, k] = estimateParameters(n, fp)
    return new RedisBloom(redis, key, m, k)
  }

  async add(data: string | Buffer) {
    const locations = this.getLocations(data)
    await this.redisBitSet.set(locations)
  }

  async check(data: string | Buffer) {
    const locations = this.getLocations(data)
    return this.redisBitSet.check(locations)
  }

  private getLocations(data: string | Buffer): number[] {
    const res: number[] = []
    const d = Buffer.from(data)
    for (let i = 0; i < this.k; i++) {
      const hashValue = this.hash(Buffer.concat([d, Buffer.from(`${i}`)]))
      res.push(hashValue % this.m)
    }
    return res
  }

  private hash(data: string | Buffer): number {
    return this.murmur32(data).result()
  }
}

const bloomScriptKey = Symbol.for('node-kit bloomScriptKey')

const addBloomScriptCommand = (redis: Redis) => {
  objOnceGuard(redis, bloomScriptKey, () => {
    redis.defineCommand('bloomSetBits', {
      numberOfKeys: 1,
      lua: `
for _, offset in ipairs(ARGV) do
  redis.call("setbit", KEYS[1], offset, 1)
end
`,
    })

    redis.defineCommand('bloomTestBits', {
      numberOfKeys: 1,
      lua: `
for _, offset in ipairs(ARGV) do
  if tonumber(redis.call("getbit", KEYS[1], offset)) == 0 then
    return false
  end
end
return true
`,
    })
  })
}

interface ExtRedis extends Redis {
  bloomSetBits(key: string, ...args: string[]): Promise<void>
  bloomTestBits(key: string, ...args: string[]): Promise<number>
}

export class RedisBitSet {
  private readonly extRedis: ExtRedis

  constructor(redis: Redis, readonly key: string, readonly m: number) {
    addBloomScriptCommand(redis)
    this.extRedis = redis as ExtRedis
  }

  async set(offsets: number[]) {
    const args = this.buildArgs(offsets)
    await this.extRedis.bloomSetBits(this.key, ...args)
  }

  async check(offsets: number[]) {
    const args = this.buildArgs(offsets)
    const res = await this.extRedis.bloomTestBits(this.key, ...args)
    return res === 1
  }

  private buildArgs(offsets: number[]): string[] {
    const res: string[] = []
    for (const o of offsets) {
      if (o >= this.m) {
        throw new Error('too large offset')
      }
      res.push(`${o}`)
    }
    return res
  }
}
