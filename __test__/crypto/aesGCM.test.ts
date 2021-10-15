import { randomBytes } from 'crypto'
import { randRangeInt, randString } from '../../src'
import { AesGCM } from '../../src/crypto/aesGCM'
import { intRange } from '../testUtils'

describe.each([128, 192, 256])('aes-%d-gcm', (t) => {
  const keyLen = t / 8
  it('should works', () => {
    intRange(100).forEach(() => {
      const key = randString(keyLen)
      const testBuf = randomBytes(randRangeInt(1, 1000))
      const enc = AesGCM.encrypt(testBuf, key)
      const dec = AesGCM.decrypt(enc, key)
      expect(dec.equals(testBuf)).toBeTruthy()
    })
  })
})

describe('invald key', () => {
  it('should throw', () => {
    expect(() => AesGCM.getAlgorithmByKey('0'.repeat(100))).toThrow()
  })
})

describe('test decrypt encrypted data from golang', () => {
  const testData = 'hello2222-cdscsdcsd'
  it('aes-256-gcm', () => {
    expect(
      AesGCM.decrypt(
        Buffer.from(
          '9d2cdd1c45bd6d1f360ec7815a6d5fb98a71d37a6a91bf6f6f9183b0d00b1aba0b0f1ee5c09bff0e3ec1e72b6468a0',
          'hex'
        ),
        '0'.repeat(32)
      ).toString()
    ).toBe(testData)
  })

  it('aes-192-gcm', () => {
    expect(
      AesGCM.decrypt(
        Buffer.from(
          '70c8dbf48e7979572d834adeb01201ae3e4a247e81d7c84d29cd1728b2723836db635cde9a5aff748c277263f5eae7',
          'hex'
        ),
        '0'.repeat(24)
      ).toString()
    ).toBe(testData)
  })

  it('aes-128-gcm', () => {
    expect(
      AesGCM.decrypt(
        Buffer.from(
          '185ef28d6c6624144cb01d60dcaa8029df3c997f3cdae16e109a0af276d1896bd028ffbccb80283736568f02450cdc',
          'hex'
        ),
        '0'.repeat(16)
      ).toString()
    ).toBe(testData)
  })
})
