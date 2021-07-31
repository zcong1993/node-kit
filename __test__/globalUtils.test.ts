import {
  createGlobalKey,
  registerGlobal,
  unregisterGlobal,
  getGlobal,
  getOrCreateSync,
  getOrCreate,
} from '../src/globalUtils'
import { delayFn, repeatCall } from './testUtils'

describe('globalUtils', () => {
  const test1 = createGlobalKey('test1')
  const test2 = createGlobalKey('test2')
  const testInstance1 = { a: 1 }

  it('registerGlobal should work', () => {
    expect(registerGlobal(test1, testInstance1)).toBeTruthy()
    expect(registerGlobal(test1, testInstance1)).toBeFalsy()
    expect(registerGlobal(test1, testInstance1, true)).toBeTruthy()
  })

  it('getGlobal should work', () => {
    expect(getGlobal(test1)).toBe(testInstance1)
    expect(getGlobal(test2)).toBeUndefined()
  })

  it('unregisterGlobal should work', () => {
    unregisterGlobal(test1)
    unregisterGlobal(test2)
    expect(getGlobal(test1)).toBeUndefined()
    expect(getGlobal(test2)).toBeUndefined()
  })

  it('getOrCreateSync', () => {
    unregisterGlobal(test1)
    unregisterGlobal(test2)

    const fn = jest.fn().mockImplementation(() => testInstance1)

    expect(getOrCreateSync(test1, fn)).toBe(testInstance1)
    expect(getOrCreateSync(test1, fn)).toBe(testInstance1)

    expect(fn).toBeCalledTimes(1)
  })

  it('getOrCreateSync already registered', () => {
    unregisterGlobal(test1)
    registerGlobal(test1, testInstance1)

    const fn = jest.fn().mockImplementation(() => testInstance1)

    expect(getOrCreateSync(test1, fn)).toBe(testInstance1)
    expect(fn).toBeCalledTimes(0)
  })

  it('getOrCreate', async () => {
    unregisterGlobal(test1)

    const fn = jest.fn().mockImplementation(delayFn(100, testInstance1))

    await repeatCall(10, async () => {
      expect(await getOrCreate(test1, fn)).toBe(testInstance1)
    })

    expect(fn).toBeCalledTimes(1)
  })

  it('getOrCreate', async () => {
    unregisterGlobal(test1)
    registerGlobal(test1, testInstance1)

    const fn = jest.fn().mockImplementation(delayFn(100, testInstance1))

    await repeatCall(10, async () => {
      expect(await getOrCreate(test1, fn)).toBe(testInstance1)
    })

    expect(fn).toBeCalledTimes(0)
  })
})
