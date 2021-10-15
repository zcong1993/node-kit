import { randomBytes } from 'crypto'
import { randRangeInt, randString } from '../../src'
import { AesCBC } from '../../src/crypto/aesCBC'
import { intRange } from '../testUtils'

describe.each([128, 192, 256])('aes-%d-cbc', (t) => {
  const keyLen = t / 8
  it('should works', () => {
    intRange(100).forEach(() => {
      const key = randString(keyLen)
      const testBuf = randomBytes(randRangeInt(1, 1000))
      const enc = AesCBC.encrypt(testBuf, key)
      const dec = AesCBC.decrypt(enc, key)
      expect(dec.equals(testBuf)).toBeTruthy()
    })
  })
})

describe('invald key', () => {
  it('should throw', () => {
    expect(() => AesCBC.getAlgorithmByKey('0'.repeat(100))).toThrow()
  })
})

describe('test decrypt encrypted data from golang with PKCS5 padding', () => {
  const testData = 'hello2222-cdscsdcsd'
  it('aes-256-cbc', () => {
    expect(
      AesCBC.decrypt(
        Buffer.from(
          'ddf54518f68f4eb4f634a03fa9b387b2b483845f576ca8fe7ff609a93c6f15da141e8b5935c497dfa8cca01559504093',
          'hex'
        ),
        '0'.repeat(32)
      ).toString()
    ).toBe(testData)
  })

  it('aes-192-cbc', () => {
    expect(
      AesCBC.decrypt(
        Buffer.from(
          '55c0d1b58bf5c07fe50b223e69e87399cc708e21b9dadddc46c5fa4a5ac38e413912b84d37e32a59705b7128095adad9',
          'hex'
        ),
        '0'.repeat(24)
      ).toString()
    ).toBe(testData)
  })

  it('aes-128-cbc', () => {
    expect(
      AesCBC.decrypt(
        Buffer.from(
          'd1660172538dc2d985f6824f37a11f0fc80313fbf134b209cc80e3072fc14d4cb1b54f15f9c4598a68a20fc8958ef631',
          'hex'
        ),
        '0'.repeat(16)
      ).toString()
    ).toBe(testData)
  })
})
