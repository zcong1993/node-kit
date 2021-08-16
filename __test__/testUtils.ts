import { setTimeout } from 'timers/promises'
import Redis, { Redis as TypeRedis } from 'ioredis'

export const sleep = setTimeout

export const delayFn =
  <T>(timeout: number, res: T) =>
  async () => {
    await setTimeout(timeout)
    return res
  }

export const intRange = (num: number, start = 0) =>
  Array(num)
    .fill(null)
    .map((_, i) => i + start)

export const repeatCall = async <T>(num: number, fn: () => Promise<T>) => {
  return Promise.all(
    Array(num)
      .fill(null)
      .map(() => fn())
  )
}

export const repeatCallSync = <T>(num: number, fn: () => T) => {
  return Array(num)
    .fill(null)
    .map(() => fn())
}

export const setupRedis = (
  redisUrl: string = process.env.Redis
): [TypeRedis, () => void] => {
  const redis = new Redis(redisUrl)
  return [redis, () => redis.disconnect()]
}
