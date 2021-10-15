import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  BinaryLike,
  CipherGCMTypes,
} from 'crypto'

export type AesGCMType = 128 | 192 | 256

// AesGCM compact with golang
export class AesGCM {
  static validKeyLengths = [16, 24, 32]
  static authTagLength = 16
  static ivLength = 12

  /**
   * encrypt a text string or buffer
   * @param plaintext - text string of buffer to encrypt
   * @param key - encryption secret key
   * @returns [iv:12][encryptedString][authTag:16]
   */
  static encrypt(plaintext: BinaryLike, key: string) {
    const iv = randomBytes(AesGCM.ivLength)
    const cipher = createCipheriv(AesGCM.getAlgorithmByKey(key), key, iv)
    const encryptedBuffer = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag()
    return Buffer.concat([iv, encryptedBuffer, authTag])
  }

  /**
   * decrypt
   * @param encrypted - encrypted text
   * @param key - encryption secret key
   * @returns Buffer
   */
  static decrypt(encrypted: Buffer, key: string) {
    const iv = encrypted.slice(0, 12)
    const authTag = encrypted.slice(encrypted.length - 16)
    const encryptedText = encrypted.slice(12, encrypted.length - 16)
    const decipher = createDecipheriv(AesGCM.getAlgorithmByKey(key), key, iv)
    decipher.setAuthTag(authTag)
    return Buffer.concat([decipher.update(encryptedText), decipher.final()])
  }

  /**
   * get aes gcm algorithm by key
   * 16(aes-128-gcm), 24(aes-192-gcm), 32(aes-256-gcm)
   * @param key - encryption secret key
   * @returns CipherGCMTypes
   */
  static getAlgorithmByKey(key: string) {
    if (!AesGCM.validKeyLengths.includes(key?.length)) {
      throw new Error(
        'aes gcm key length should be one of 16(aes-128-gcm), 24(aes-192-gcm), 32(aes-256-gcm)'
      )
    }
    return `aes-${key.length * 8}-gcm` as CipherGCMTypes
  }
}
