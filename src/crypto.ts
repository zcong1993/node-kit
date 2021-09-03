import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto'

export type StringBuf = string | Buffer

/**
 * get md5 string of a string or buffer
 * @param str - string of buffer to md5
 * @returns hex string
 */
export const md5 = (str: StringBuf) =>
  createHash('md5').update(str).digest('hex')

/**
 * simple AesCipher to encrypt and decrypt a string of buffer
 */
export class AesCipher {
  /**
   * @param algorithm - will passing to createCipheriv, eg: aes-256-cbc
   * @param ivLength - iv length
   */
  constructor(
    readonly algorithm: string,
    private readonly ivLength: number = 16
  ) {}

  /**
   * encrypt a text string or buffer
   * @param input - text string of buffer to encrypt
   * @param encryptionKey - encryption secret key
   * @returns [randomIv]:[encryptedString]
   */
  encrypt(input: StringBuf, encryptionKey: string): string {
    const iv = randomBytes(this.ivLength)
    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(encryptionKey),
      iv
    )
    let encrypted = cipher.update(input)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  }

  /**
   * decrypt
   * @param encrypted - encrypted text
   * @param encryptionKey - encryption secret key
   * @returns Buffer
   */
  decrypt(encrypted: string, encryptionKey: string) {
    const textParts: string[] = encrypted.split(':')
    const ivStr = textParts.shift()
    if (!ivStr) {
      throw new Error('iv error')
    }
    const iv = Buffer.from(ivStr, 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(encryptionKey),
      iv
    )
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted
  }
}
