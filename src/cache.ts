import type { Cacher, Hasher } from '@zcong/node-redis-cache'

export interface CacheOption {
  keyPrefix: string
  expire: number | (() => number)
  codec?: string
  keyHasher?: Hasher
}

/**
 * cache decorator for cache a method with dynamic params,
 * function should always return a json object
 * @param cacher - cacher provider
 * @param opt - cache options
 * @returns
 *
 * @remark
 * this decorator is warpper of cacher.cacheWrapper, more detail
 * you can see https://github.com/zcong1993/node-redis-cache/blob/4540ddaead622c45925a550e18563120108d44a2/src/cache.ts#L51
 */
export const cache = (cacher: Cacher, opt: CacheOption): MethodDecorator => {
  return (_1: any, _2: string, descriptor: PropertyDescriptor) => {
    const orginMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const expire =
        typeof opt.expire === 'function' ? opt.expire() : opt.expire

      return cacher.cacheWrapper(
        opt.keyPrefix,
        orginMethod,
        expire,
        opt.codec,
        opt.keyHasher,
        this
      )(...args)
    }
  }
}
