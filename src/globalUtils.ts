const _global: any = typeof globalThis === 'object' ? globalThis : global

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
