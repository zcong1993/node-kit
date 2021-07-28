import {
  createGlobalKey,
  registerGlobal,
  unregisterGlobal,
  getGlobal,
} from '../src/globalUtils'

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
})
