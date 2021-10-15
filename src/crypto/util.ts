import { createCipheriv, createDecipheriv, BinaryLike } from 'crypto'

/**
 * util function for aes encrypt with [iv][encryptedString] format
 * @param aesAlgorithm - aes algorithm
 * @param plaintext - text string of buffer to encrypt
 * @param key - encryption secret key
 * @param iv - aes iv
 * @returns [iv][encryptedString]
 */
export const simpleAesEncrypt = (
  aesAlgorithm: string,
  plaintext: BinaryLike,
  key: string,
  iv: Buffer
) => {
  const cipher = createCipheriv(aesAlgorithm, key, iv)
  const encryptedBuffer = Buffer.concat([
    cipher.update(plaintext),
    cipher.final(),
  ])
  return Buffer.concat([iv, encryptedBuffer])
}

/**
 * util function for aes decrypt with [iv][encryptedString] format
 * @param aesAlgorithm - aes algorithm
 * @param encrypted - ncrypted text
 * @param key - encryption secret key
 * @param ivLength - aes iv
 * @returns Buffer
 */
export const simpleAesDecrypt = (
  aesAlgorithm: string,
  encrypted: Buffer,
  key: string,
  ivLength: number
) => {
  const iv = encrypted.slice(0, ivLength)
  const encryptedText = encrypted.slice(ivLength)
  const decipher = createDecipheriv(aesAlgorithm, key, iv)
  return Buffer.concat([decipher.update(encryptedText), decipher.final()])
}
