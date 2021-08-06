import { Singleflight } from '@zcong/singleflight'

const _global: any = typeof globalThis === 'object' ? globalThis : global
const sf = new Singleflight()

/**
 * helper function for create symbol key
 * @param key
 * @returns
 */
export const createGlobalKey = (key: string) => Symbol.for(key)

/**
 * register an instance to global
 * @param key
 * @param instance
 * @param allowOverride
 * @returns
 */
export const registerGlobal = <T>(
  key: symbol,
  instance: T,
  allowOverride = false
): boolean => {
  if (!allowOverride && _global[key]) {
    return false
  }

  _global[key] = instance

  return true
}

/**
 * get global instance by key
 * @param key
 * @returns
 */
export const getGlobal = <T>(key: symbol): T | undefined => {
  return _global[key]
}

/**
 * unregister a global instance
 * @param key
 */
export const unregisterGlobal = (key: symbol) => {
  if (_global[key]) {
    delete _global[key]
  }
}

/**
 * get or create global instance, lazy load
 * @param key
 * @param factory only support sync function
 * @returns
 */
export const getOrCreateSync = <T>(key: symbol, factory: () => T): T => {
  const instance = getGlobal<T>(key)
  if (instance) {
    return instance
  }

  const newInstance = factory()
  registerGlobal(key, newInstance)

  return newInstance
}

/**
 * async version lazy load
 * only call factory function once even in concurrent calls
 * @param key
 * @param factory async factory
 * @returns
 */
export const getOrCreate = async <T>(
  key: symbol,
  factory: () => Promise<T>
): Promise<T> => {
  const instance = getGlobal<T>(key)
  if (instance) {
    return instance
  }

  const newInstance = await sf.do(key, factory)
  registerGlobal(key, newInstance)

  return newInstance
}
