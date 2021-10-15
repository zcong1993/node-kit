import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  BinaryLike,
} from 'crypto'

// AesCBC compact with golang
export class AesCBC {
  static validKeyLengths = [16, 24, 32]
  static ivLength = 16

  /**
   * encrypt a text string or buffer
   * @param plaintext - text string of buffer to encrypt
   * @param key - encryption secret key
   * @returns [iv][encryptedString]
   */
  static encrypt(plaintext: BinaryLike, key: string) {
    const iv = randomBytes(AesCBC.ivLength)
    const cipher = createCipheriv(AesCBC.getAlgorithmByKey(key), key, iv)
    const encryptedBuffer = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ])
    return Buffer.concat([iv, encryptedBuffer])
  }

  /**
   * decrypt
   * @param encrypted - encrypted text
   * @param key - encryption secret key
   * @returns Buffer
   */
  static decrypt(encrypted: Buffer, key: string) {
    const iv = encrypted.slice(0, AesCBC.ivLength)
    const encryptedText = encrypted.slice(AesCBC.ivLength)
    const decipher = createDecipheriv(AesCBC.getAlgorithmByKey(key), key, iv)
    return Buffer.concat([decipher.update(encryptedText), decipher.final()])
  }

  /**
   * get aes cbc algorithm by key
   * 16(aes-128-cbc), 24(aes-192-cbc), 32(aes-256-cbc)
   * @param key - encryption secret key
   * @returns
   */
  static getAlgorithmByKey(key: string) {
    if (!AesCBC.validKeyLengths.includes(key?.length)) {
      throw new Error(
        'aes cbc key length should be one of 16(aes-128-cbc), 24(aes-192-cbc), 32(aes-256-cbc)'
      )
    }
    return `aes-${key.length * 8}-cbc`
  }
}
