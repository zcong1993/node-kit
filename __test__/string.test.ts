import { randString } from '../src/string'

describe('string', () => {
  it('randString', () => {
    for (let i = 1; i < 100; i++) {
      expect(randString(i).length).toBe(i)
    }
  })
})
