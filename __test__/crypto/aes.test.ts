import { randomBytes } from 'crypto'
import { randRangeInt, randString } from '../../src'
import { AesGCM, AesGCMType } from '../../src/crypto/aes'
import { intRange } from '../testUtils'

describe.each([128, 192, 256])('aes-%d-gcm', (t: AesGCMType) => {
  const keyLen = t / 8
  const ac = new AesGCM(t)
  it('should works', () => {
    intRange(100).forEach(() => {
      const key = randString(keyLen)
      const testBuf = randomBytes(randRangeInt(1, 1000))
      const enc = ac.encrypt(testBuf, key)
      const dec = ac.decrypt(enc, key)
      expect(dec.equals(testBuf)).toBeTruthy()
    })
  })
})

describe('invald type', () => {
  it('should throw', () => {
    expect(() => new AesGCM(100 as any)).toThrow()
  })
})

describe('test decrypt encrypted data from golang', () => {
  const testData = 'hello2222-cdscsdcsd'
  it('aes-256-gcm', () => {
    const ac = new AesGCM(256)
    expect(
      ac
        .decrypt(
          Buffer.from(
            '9d2cdd1c45bd6d1f360ec7815a6d5fb98a71d37a6a91bf6f6f9183b0d00b1aba0b0f1ee5c09bff0e3ec1e72b6468a0',
            'hex'
          ),
          '0'.repeat(32)
        )
        .toString()
    ).toBe(testData)
  })

  it('aes-192-gcm', () => {
    const ac = new AesGCM(192)
    expect(
      ac
        .decrypt(
          Buffer.from(
            '70c8dbf48e7979572d834adeb01201ae3e4a247e81d7c84d29cd1728b2723836db635cde9a5aff748c277263f5eae7',
            'hex'
          ),
          '0'.repeat(24)
        )
        .toString()
    ).toBe(testData)
  })

  it('aes-128-gcm', () => {
    const ac = new AesGCM(128)
    expect(
      ac
        .decrypt(
          Buffer.from(
            '185ef28d6c6624144cb01d60dcaa8029df3c997f3cdae16e109a0af276d1896bd028ffbccb80283736568f02450cdc',
            'hex'
          ),
          '0'.repeat(16)
        )
        .toString()
    ).toBe(testData)
  })
})
