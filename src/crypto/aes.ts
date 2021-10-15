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
  static authTagLength = 16
  static ivLength = 12
  private algorithm: CipherGCMTypes
  constructor(readonly type: AesGCMType) {
    if (![128, 192, 256].includes(type)) {
      throw new Error('aes gcm type should be one of 128, 192, 256')
    }

    this.algorithm = `aes-${this.type}-gcm`
  }

  /**
   * encrypt a text string or buffer
   * @param plaintext - text string of buffer to encrypt
   * @param key - encryption secret key
   * @returns [iv:12][encryptedString][authTag:16]
   */
  encrypt(plaintext: BinaryLike, key: string) {
    const iv = randomBytes(AesGCM.ivLength)
    const cipher = createCipheriv(this.algorithm, key, iv)
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
  decrypt(encrypted: Buffer, key: string) {
    const iv = encrypted.slice(0, 12)
    const authTag = encrypted.slice(encrypted.length - 16)
    const encryptedText = encrypted.slice(12, encrypted.length - 16)
    const decipher = createDecipheriv(this.algorithm, key, iv)
    decipher.setAuthTag(authTag)
    return Buffer.concat([decipher.update(encryptedText), decipher.final()])
  }
}
