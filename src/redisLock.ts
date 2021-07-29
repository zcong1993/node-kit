import type { Redis } from 'ioredis'
import { randString } from './string'

export type UnLockFn = () => Promise<void>

/**
 * use redis create mutex lock, this function is more safety
 * cause it only unlock itself
 * @param redis
 * @param key
 * @param px
 * @returns [getLock: boolean, unlockFn: () => Promise<void>]
 */
export const tryLock = async (
  redis: Redis,
  key: string,
  px: number
): Promise<[boolean, UnLockFn]> => {
  const val = `${Date.now()}-${randString(10)}`
  const lock = await redis.set(key, val, 'nx', 'px', px)

  // noop
  let unlockFn = async () => {}

  if (lock) {
    // only unlock self lock
    unlockFn = async () => {
      if ((await redis.get(key)) === val) {
        await redis.del(key)
      }
    }
  }

  return [lock !== null, unlockFn]
}

/**
 * run a function with mutext barrier
 * @param redis
 * @param key
 * @param fn
 * @param px
 * @returns
 */
export const runWithMutex = async <T>(
  redis: Redis,
  key: string,
  fn: () => Promise<T | null>,
  px: number
) => {
  const [lock, unlockFn] = await tryLock(redis, key, px)
  if (!lock) {
    return null
  }
  try {
    return await fn()
  } finally {
    await unlockFn()
  }
}
