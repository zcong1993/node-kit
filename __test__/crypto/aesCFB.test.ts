import { randomBytes } from 'crypto'
import { randRangeInt, randString } from '../../src'
import { AesCFB } from '../../src/crypto/aesCFB'
import { intRange } from '../testUtils'

describe.each([128, 192, 256])('aes-%d-cfb', (t) => {
  const keyLen = t / 8
  it('should works', () => {
    intRange(100).forEach(() => {
      const key = randString(keyLen)
      const testBuf = randomBytes(randRangeInt(1, 1000))
      const enc = AesCFB.encrypt(testBuf, key)
      const dec = AesCFB.decrypt(enc, key)
      expect(dec.equals(testBuf)).toBeTruthy()
    })
  })
})

describe('invald key', () => {
  it('should throw', () => {
    expect(() => AesCFB.getAlgorithmByKey('0'.repeat(100))).toThrow()
  })
})

describe('test decrypt encrypted data from golang', () => {
  const testData = 'hello2222-cdscsdcsd'
  it('aes-256-cfb', () => {
    expect(
      AesCFB.decrypt(
        Buffer.from(
          '7819adad8884dabaa3f24772f7af31e708b9bc02903352d68796aca7a4509638cca027',
          'hex'
        ),
        '0'.repeat(32)
      ).toString()
    ).toBe(testData)
  })

  it('aes-192-cfb', () => {
    expect(
      AesCFB.decrypt(
        Buffer.from(
          '86425369f8b7cadeae25f91af02099723b6356f29b6d725fbe4a86b3b13895b9586777',
          'hex'
        ),
        '0'.repeat(24)
      ).toString()
    ).toBe(testData)
  })

  it('aes-128-cfb', () => {
    expect(
      AesCFB.decrypt(
        Buffer.from(
          'ec1f3be513576ef5c8291125ea5bbd5b8f22595651f64c0d33cf3f3242e2350bdaa8cf',
          'hex'
        ),
        '0'.repeat(16)
      ).toString()
    ).toBe(testData)
  })
})
