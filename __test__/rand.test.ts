import {
  randRangeFloat,
  randRangeInt,
  unstableDeviation,
  unstableDeviationInt,
} from '../src/rand'
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

describe('unstableDeviation', () => {
  it('invalid deviation should be fixed', () => {
    expect(unstableDeviation(1000, -1)).toBe(1000)
    intRange(1000).forEach(() => {
      const res = unstableDeviation(1000, 2)
      expect(res > 0 && res <= 2000).toBeTruthy()
    })
  })

  it('should work', () => {
    intRange(1000).forEach(() => {
      const res = unstableDeviation(100000, 0.05)
      expect(
        res > 100000 * (1 - 0.05) && res <= 100000 * (1 + 0.05)
      ).toBeTruthy()
    })
  })
})

describe('unstableDeviationInt', () => {
  it('should work', () => {
    intRange(1000).forEach(() => {
      const res = unstableDeviationInt(100000, 0.05)
      expect(
        res >= 100000 * (1 - 0.05) && res <= 100000 * (1 + 0.05)
      ).toBeTruthy()
      expect(Math.floor(res)).toBe(res)
    })
  })
})
