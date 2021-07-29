import type { Redis } from 'ioredis'
import { randString } from './string'

export type UnLockFn = () => Promise<void>

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
