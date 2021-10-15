import { randomBytes, BinaryLike } from 'crypto'
import { simpleAesEncrypt, simpleAesDecrypt } from './util'

// AesCTR compact with golang
export class AesCTR {
  static validKeyLengths = [16, 24, 32]
  static ivLength = 16

  /**
   * encrypt a text string or buffer
   * @param plaintext - text string of buffer to encrypt
   * @param key - encryption secret key
   * @returns [iv][encryptedString]
   */
  static encrypt(plaintext: BinaryLike, key: string) {
    const iv = randomBytes(AesCTR.ivLength)
    return simpleAesEncrypt(AesCTR.getAlgorithmByKey(key), plaintext, key, iv)
  }

  /**
   * decrypt
   * @param encrypted - encrypted text
   * @param key - encryption secret key
   * @returns Buffer
   */
  static decrypt(encrypted: Buffer, key: string) {
    return simpleAesDecrypt(
      AesCTR.getAlgorithmByKey(key),
      encrypted,
      key,
      AesCTR.ivLength
    )
  }

  /**
   * get aes ctr algorithm by key
   * 16(aes-128-ctr), 24(aes-192-ctr), 32(aes-256-ctr)
   * @param key - encryption secret key
   * @returns
   */
  static getAlgorithmByKey(key: string) {
    if (!AesCTR.validKeyLengths.includes(key?.length)) {
      throw new Error(
        'aes ctr key length should be one of 16(aes-128-ctr), 24(aes-192-ctr), 32(aes-256-ctr)'
      )
    }
    return `aes-${key.length * 8}-ctr`
  }
}
