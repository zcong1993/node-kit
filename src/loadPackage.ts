import { createGlobalKey, getOrCreateSync } from './globalUtils'

/**
 * dynamic load a npm package, use as lazy load a optional package
 * @param packageName - npm package name
 * @param context - context message for error log
 * @param loaderFn - custom load function
 * @returns loaded package module
 */
export const loadPackage = <T = any>(
  packageName: string,
  context: string,
  loaderFn?: Function
): T => {
  try {
    return loaderFn ? loaderFn() : require(packageName)
  } catch (e) /* c8 ignore next 5 */ {
    console.error(
      `The "${packageName}" package is missing. Please, make sure to install this library ($ npm install ${packageName}) to take advantage of ${context}.`
    )
    process.exit(1)
  }
}

/**
 * get or load a npm package once
 * @param packageName - npm package name
 * @param context - context message for error log
 * @param loaderFn - custom load function
 * @returns loaded package module
 */
export const loadPackageOnce = <T = any>(
  packageName: string,
  context: string,
  loaderFn?: Function
): T => {
  return getOrCreateSync(createGlobalKey(`${context} ${packageName}`), () =>
    loadPackage(packageName, context, loaderFn)
  )
}
