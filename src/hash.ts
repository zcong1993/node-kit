import { createHash } from 'crypto'
import { StringBuf } from './types'

/**
 * get md5 hex string of a string or buffer
 * @param str - string of buffer to md5
 * @returns hex string
 */
export const md5 = (str: StringBuf) =>
  createHash('md5').update(str).digest('hex')

/**
 * get sha256 string of a string or buffer
 * @param str - input string or Buffer
 * @returns hex string
 */
export const sha256 = (str: StringBuf) =>
  createHash('sha256').update(str).digest('hex')
