import { randString, randRangeInt } from '../src'
import { md5, AesCipher } from '../src/crypto'

describe('md5', () => {
  test.each([
    ['d2580841f177e844971c32b9f4bfaa5a', '3443434434'],
    ['2ec1991721b87b535a69ea963b0a6368', 'trueblue'],
    ['d8596d2a039a3547c1ae5eeb94f5a2ce', 'areeb2015'],
    ['7ddeef932b7177540ee5f99c445aa971', '986644'],
    ['f799c7725ba6830f41f0a8f886c6ff94', '13778'],
  ])('%s', (expected, str) => {
    expect(md5(str)).toBe(expected)
  })
})

describe('AesCipher', () => {
  const testStrings = Array(100)
    .fill(null)
    .map(() => randString(randRangeInt(10, 30)))

  const algorithms = [
    'aes-128-cbc',
    'aes-128-cbc-hmac-sha1',
    'aes-128-cfb',
    'aes-128-cfb1',
    'aes-128-cfb8',
    'aes-128-ctr',
    'aes-128-ofb',
    'aes-192-cbc',
    'aes-192-cfb',
    'aes-192-cfb1',
    'aes-192-cfb8',
    'aes-192-ctr',
    'aes-192-ofb',
    'aes-256-cbc',
    'aes-256-cbc-hmac-sha1',
    'aes-256-cfb',
    'aes-256-cfb1',
    'aes-256-cfb8',
    'aes-256-ctr',
    'aes-256-ofb',
    'aes128',
    'aes192',
    'aes256',
  ]

  test.each(algorithms.map((a) => [a]))('%s', (algorithm) => {
    const aes = new AesCipher(algorithm)
    const keyLen = parseInt(algorithm.match(/(\d{3})/)[0], 10)
    const key = randString(keyLen / 8)
    for (const text of testStrings) {
      const encrypted = aes.encrypt(text, key)
      expect(aes.decrypt(encrypted, key).toString()).toBe(text)
    }
  })

  it('iv error', () => {
    const aes = new AesCipher('aes-128-cbc')
    expect(() => aes.decrypt('', 'aaa')).toThrow()
  })
})
