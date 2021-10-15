import { randomBytes } from 'crypto'
import { randRangeInt, randString } from '../../src'
import { AesCTR } from '../../src/crypto/aesCTR'
import { intRange } from '../testUtils'

describe.each([128, 192, 256])('aes-%d-ctr', (t) => {
  const keyLen = t / 8
  it('should works', () => {
    intRange(100).forEach(() => {
      const key = randString(keyLen)
      const testBuf = randomBytes(randRangeInt(1, 1000))
      const enc = AesCTR.encrypt(testBuf, key)
      const dec = AesCTR.decrypt(enc, key)
      expect(dec.equals(testBuf)).toBeTruthy()
    })
  })
})

describe('invald key', () => {
  it('should throw', () => {
    expect(() => AesCTR.getAlgorithmByKey('0'.repeat(100))).toThrow()
  })
})

describe('test decrypt encrypted data from golang', () => {
  const testData = 'hello2222-cdscsdcsd'
  it('aes-256-ctr', () => {
    expect(
      AesCTR.decrypt(
        Buffer.from(
          'bd477d096dc50d12f555f527e1d679530f7c8919d9ecdc4e6d26f14e1abb832c412376',
          'hex'
        ),
        '0'.repeat(32)
      ).toString()
    ).toBe(testData)
  })

  it('aes-192-ctr', () => {
    expect(
      AesCTR.decrypt(
        Buffer.from(
          '9932e293f35181d625fb0d25529d2343ad05044d91f391fdf88a9c32ea6e25f29067ee',
          'hex'
        ),
        '0'.repeat(24)
      ).toString()
    ).toBe(testData)
  })

  it('aes-128-ctr', () => {
    expect(
      AesCTR.decrypt(
        Buffer.from(
          'c552d9b25fa2809a454d529b6c2269ee1c7ee351a29748af1d2bac010c1e6cd95b8c57',
          'hex'
        ),
        '0'.repeat(16)
      ).toString()
    ).toBe(testData)
  })
})
