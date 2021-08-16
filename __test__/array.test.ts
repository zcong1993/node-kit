import { unique } from '../src/array'

describe('unique', () => {
  it('should work', () => {
    expect(unique([1, 2, 3, 4, -1, 2])).toStrictEqual([1, 2, 3, 4, -1])
    expect(unique([1, 2, 3, 4, -1])).toStrictEqual([1, 2, 3, 4, -1])
  })

  it('work with object', () => {
    const a = { age: 1 }
    const arr1 = [a, a]
    expect(unique(arr1)).toStrictEqual([a])
    const b = { age: 1 }
    const arr2 = [a, b]
    expect(unique(arr2)).toStrictEqual(arr2)
  })
})
