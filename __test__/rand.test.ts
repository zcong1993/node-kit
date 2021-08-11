import { randRangeFloat, randRangeInt } from '../src/rand'
import { intRange } from './testUtils'

describe('randRangeFloat', () => {
  it('should work', () => {
    intRange(10).forEach((i) => {
      const min = -100
      const max = i

      intRange(100).forEach(() => {
        const rd = randRangeFloat(min, max)

        expect(rd >= min && rd < max).toBeTruthy()
      })
    })
  })
})

describe('randRangeInt', () => {
  it('should work', () => {
    intRange(10).forEach((i) => {
      const min = -100
      const max = i

      intRange(100).forEach(() => {
        const rd = randRangeInt(min, max)

        expect(rd >= min && rd < max).toBeTruthy()
      })
    })
  })
})
