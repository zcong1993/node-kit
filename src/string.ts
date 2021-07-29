import crypto from 'crypto'

export const randString = (n: number): string => {
  return crypto
    .randomBytes(Math.ceil(n / 2))
    .toString('hex')
    .slice(n % 2)
}
