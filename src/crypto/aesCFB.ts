import { randomBytes, BinaryLike } from 'crypto'
import { simpleAesEncrypt, simpleAesDecrypt } from './util'

// AesCFB compact with golang
export class AesCFB {
  static validKeyLengths = [16, 24, 32]
  static ivLength = 16

  /**
   * encrypt a text string or buffer
   * @param plaintext - text string of buffer to encrypt
   * @param key - encryption secret key
   * @returns [iv][encryptedString]
   */
  static encrypt(plaintext: BinaryLike, key: string) {
    const iv = randomBytes(AesCFB.ivLength)
    return simpleAesEncrypt(AesCFB.getAlgorithmByKey(key), plaintext, key, iv)
  }

  /**
   * decrypt
   * @param encrypted - encrypted text
   * @param key - encryption secret key
   * @returns Buffer
   */
  static decrypt(encrypted: Buffer, key: string) {
    return simpleAesDecrypt(
      AesCFB.getAlgorithmByKey(key),
      encrypted,
      key,
      AesCFB.ivLength
    )
  }

  /**
   * get aes cfb algorithm by key
   * 16(aes-128-cfb), 24(aes-192-cfb), 32(aes-256-cfb)
   * @param key - encryption secret key
   * @returns
   */
  static getAlgorithmByKey(key: string) {
    if (!AesCFB.validKeyLengths.includes(key?.length)) {
      throw new Error(
        'aes cfb key length should be one of 16(aes-128-cfb), 24(aes-192-cfb), 32(aes-256-cfb)'
      )
    }
    return `aes-${key.length * 8}-cfb`
  }
}
