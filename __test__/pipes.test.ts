import {
  parseIntPipe,
  parseFloatPipe,
  parseBoolPipe,
  parseEnumPipe,
  PipeErrorFactory,
} from '../src/pipes'

class TestError extends Error {}

const testErrorFactory: PipeErrorFactory = (err) => new TestError(err)

describe('parseIntPipe', () => {
  it('should return number', () => {
    expect(parseIntPipe('13')).toBe(13)
  })

  it('should throw', () => {
    expect(() => parseIntPipe('13abc')).toThrow()
    expect(() => parseIntPipe('13abc', testErrorFactory)).toThrowError(
      TestError
    )
  })
})

describe('parseFloatPipe', () => {
  it('should return number', () => {
    expect(parseFloatPipe('13.33')).toBe(13.33)
  })

  it('should throw', () => {
    expect(() => parseFloatPipe('13.322abc')).toThrow()
    expect(() => parseFloatPipe('13.322abc', testErrorFactory)).toThrowError(
      TestError
    )
  })
})

describe('parseBoolPipe', () => {
  it('should return boolean', () => {
    expect(parseBoolPipe('true')).toBe(true)
    expect(parseBoolPipe(true)).toBe(true)
    expect(parseBoolPipe('false')).toBe(false)
    expect(parseBoolPipe(false)).toBe(false)
  })

  it('should throw', () => {
    expect(() => parseBoolPipe('13.322abc')).toThrow()
    expect(() => parseBoolPipe('13.322abc', testErrorFactory)).toThrowError(
      TestError
    )
  })
})

describe('parseEnumPipe', () => {
  enum Direction {
    Up = 'UP',
  }

  enum Test {
    A = 1,
  }

  it('should return boolean', () => {
    expect(parseEnumPipe(Direction, 'UP')).toBe(Direction.Up)
    expect(parseEnumPipe(Test, 1)).toBe(Test.A)
  })

  it('should throw', () => {
    expect(() => parseEnumPipe(Direction, '13.322abc')).toThrow()
    expect(() =>
      parseEnumPipe(Direction, '13.322abc', testErrorFactory)
    ).toThrowError(TestError)
  })
})
