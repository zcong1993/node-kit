import { createGlobalKey, getOrCreateSync } from './globalUtils'

export const loadPackage = <T = any>(
  packageName: string,
  context: string,
  loaderFn?: Function
): T => {
  try {
    return loaderFn ? loaderFn() : require(packageName)
  } catch (e) /* istanbul ignore next */ {
    console.error(
      `The "${packageName}" package is missing. Please, make sure to install this library ($ npm install ${packageName}) to take advantage of ${context}.`
    )
    process.exit(1)
  }
}

export const loadPackageOnce = <T = any>(
  packageName: string,
  context: string,
  loaderFn?: Function
): T => {
  return getOrCreateSync(createGlobalKey(`${context} ${packageName}`), () =>
    loadPackage(packageName, context, loaderFn)
  )
}
