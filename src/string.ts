import crypto from 'crypto'
import { StringBuf } from './types'

/**
 * create len(n) random string
 * @param n - want string length
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
 * @param value - value to be checked
 * @returns
 */
export const isNumeric = (value: any) =>
  ['string', 'number'].includes(typeof value) &&
  !isNaN(parseFloat(value)) &&
  isFinite(value as any)

/**
 * parse int if value is Numeric or return default
 * @param value - value to be checked
 * @param defaultVal - default value when invalid value
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
 * @param value - value to be checked
 * @param defaultVal - default value when invalid value
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

/**
 * base64 encode
 * @param str - string | Buffer
 * @returns base64 string
 */
export const base64Encode = (str: StringBuf): string =>
  Buffer.from(str).toString('base64')

/**
 * base64 decode
 * @param b64 - base64 string
 * @returns string
 */
export const base64Decode = (b64: string): string =>
  Buffer.from(b64, 'base64').toString()

/**
 * hex encode
 * @param str - string | Buffer
 */
export const hexEncode = (str: StringBuf) => Buffer.from(str).toString('hex')

/**
 * hex decode
 * @param str - hex string
 */
export const hexDecode = (str: string) => Buffer.from(str, 'hex').toString()

export const buildKey = (keys: string[], step = ':') =>
  keys.filter(Boolean).join(step)
