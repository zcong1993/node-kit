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
