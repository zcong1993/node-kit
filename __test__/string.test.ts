import {
  isNumeric,
  parseFloatOrDefault,
  parseIntOrDefault,
  randString,
  base64Decode,
  base64Encode,
  hexEncode,
  hexDecode,
} from '../src/string'

describe('string', () => {
  it('randString', () => {
    for (let i = 1; i < 100; i++) {
      expect(randString(i).length).toBe(i)
    }
  })
})

describe('isNumeric', () => {
  test.each([
    ['1.0001', true],
    [1, true],
    [-1.1, true],
    ['-1', true],
    [false, false],
    ['11a', false],
    ['11.2.2', false],
  ])('%s', (val, expected) => {
    expect(isNumeric(val)).toBe(expected)
  })
})

describe('parseIntOrDefault', () => {
  it('valid', () => {
    expect(parseIntOrDefault('11', 1)).toBe(11)
    expect(parseIntOrDefault('-11', 1)).toBe(-11)
    expect(parseIntOrDefault('-11.1', 1)).toBe(-11)
    expect(parseIntOrDefault('16', 1, 16)).toBe(parseInt('16', 16))
  })

  it('invalid', () => {
    expect(parseIntOrDefault('11aa', 1)).toBe(1)
    expect(parseIntOrDefault('-11bb', 1.1)).toBe(1)
  })
})

describe('parseFloatOrDefault', () => {
  it('valid', () => {
    expect(parseFloatOrDefault('11.11', 1)).toBe(11.11)
    expect(parseFloatOrDefault('-11.11', 1)).toBe(-11.11)
  })

  it('invalid', () => {
    expect(parseFloatOrDefault('11aa', 1)).toBe(1)
    expect(parseFloatOrDefault('-11bb', 1.1)).toBe(1.1)
  })
})

describe('base64', () => {
  it('encode decode', () => {
    for (let i = 0; i < 100; i++) {
      const str = randString(i)
      const b64 = base64Encode(str)
      expect(base64Decode(b64)).toBe(str)
    }
  })

  it('encode buffer', () => {
    const str = 'test'
    const strBuf = Buffer.from('test')
    const b64 = base64Encode(strBuf)
    expect(base64Decode(b64)).toBe(str)
  })

  it('compatable test', () => {
    expect(base64Decode('YWJjMTIzIT8kKiYoKSctPUB+')).toBe(`abc123!?$*&()'-=@~`)
  })
})

describe('hex', () => {
  it('encode decode', () => {
    for (let i = 0; i < 100; i++) {
      const str = randString(i)
      const enc = hexEncode(str)
      expect(hexDecode(enc)).toBe(str)
    }
  })

  it('encode buffer', () => {
    const str = 'test'
    const strBuf = Buffer.from('test')
    const enc = hexEncode(strBuf)
    expect(hexDecode(enc)).toBe(str)
  })

  it('compatable test', () => {
    expect(hexDecode('68656C6C6F20776F726C64')).toBe('hello world')
  })
})
