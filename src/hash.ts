import { createHash } from 'crypto'

export type StringBuf = string | Buffer

/**
 * get md5 string of a string or buffer
 * @param str - string of buffer to md5
 * @returns hex string
 */
export const md5 = (str: StringBuf) =>
  createHash('md5').update(str).digest('hex')
