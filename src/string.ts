import crypto from 'crypto'

/**
 * create len(n) random string
 * @param n
 * @returns
 */
export const randString = (n: number): string => {
  return crypto
    .randomBytes(Math.ceil(n / 2))
    .toString('hex')
    .slice(n % 2)
}

/**
 * check if a value is number or number string
 * @param value
 * @returns
 */
export const isNumeric = (value: any) =>
  ['string', 'number'].includes(typeof value) &&
  !isNaN(parseFloat(value)) &&
  isFinite(value as any)

/**
 * parse int if value is Numeric or return default
 * @param value
 * @param defaultVal
 * @returns
 */
export const parseIntOrDefault = (
  value: number | string,
  defaultVal: number,
  radix: number = 10
): number => {
  if (!isNumeric(value)) {
    return parseInt(defaultVal as any, radix)
  }

  return parseInt(value as string, radix)
}

/**
 * parse float if value is Numeric or return default
 * @param value
 * @param defaultVal
 * @returns
 */
export const parseFloatOrDefault = (
  value: number | string,
  defaultVal: number
): number => {
  if (!isNumeric(value)) {
    return defaultVal
  }

  return parseFloat(value as string)
}
