import { loadEnv, EnvVal } from '../src/env'

describe('loadEnv', () => {
  it('should work', () => {
    expect(loadEnv('test')).toBeInstanceOf(EnvVal)
    expect(() => loadEnv('test', true)).toThrow()
    expect(loadEnv('test', true, { test: 'aaa' }).string()).toBe('aaa')
  })
})

describe('EnvVal', () => {
  it('string', () => {
    expect(new EnvVal('xxx', 'aaa').string()).toBe('xxx')
    expect(new EnvVal(undefined, 'aaa').string()).toBeUndefined()
  })

  it('bool', () => {
    expect(new EnvVal('true', 'aaa').bool()).toBeTruthy()
    expect(new EnvVal('1', 'aaa').bool()).toBeTruthy()
    expect(new EnvVal(undefined, 'aaa').bool()).toBeFalsy()
    expect(new EnvVal('TRUE', 'aaa').bool(['TRUE'])).toBeTruthy()
  })

  it('int', () => {
    expect(new EnvVal('10', 'aaa').int()).toBe(10)
    expect(new EnvVal(undefined, 'aaa').int()).toBeUndefined()
    expect(() => new EnvVal('aaa', 'aaa').int()).toThrow()
  })

  it('float', () => {
    expect(new EnvVal('10.1', 'aaa').float()).toBe(10.1)
    expect(new EnvVal(undefined, 'aaa').float()).toBeUndefined()
    expect(() => new EnvVal('aaa', 'aaa').float()).toThrow()
  })

  it('date', () => {
    expect(new EnvVal('2021-08-30 00:00:00', 'aaa').date()).toBeInstanceOf(Date)
    expect(new EnvVal('2021-01-02T00:00:00.000Z', 'aaa').date()).toBeInstanceOf(
      Date
    )
    expect(new EnvVal('2021-08-30', 'aaa').date()).toBeInstanceOf(Date)
    expect(new EnvVal(undefined, 'aaa').date()).toBeUndefined()
    expect(() => new EnvVal('aaa', 'aaa').date()).toThrow()
  })

  it('array', () => {
    expect(new EnvVal('1,2,3,4', 'aaa').array()).toStrictEqual([
      '1',
      '2',
      '3',
      '4',
    ])
    expect(new EnvVal(undefined, 'aaa').array()).toStrictEqual([])
    expect(new EnvVal('aaa. bbb', 'aaa').array('.')).toStrictEqual([
      'aaa',
      'bbb',
    ])
  })
})
