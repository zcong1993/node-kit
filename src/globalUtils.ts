const _global: any = typeof globalThis === 'object' ? globalThis : global

export const createGlobalKey = (key: string) => Symbol.for(key)

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

export const getGlobal = <T>(key: symbol): T | undefined => {
  return _global[key]
}

export const unregisterGlobal = (key: symbol) => {
  if (_global[key]) {
    delete _global[key]
  }
}
