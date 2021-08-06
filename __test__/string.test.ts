import {
  randString,
  isNumeric,
  parseIntOrDefault,
  parseFloatOrDefault,
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
