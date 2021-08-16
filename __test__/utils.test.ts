import { ms2s, msUntilNextDay } from '../src/utils'

describe('ms2s', () => {
  test.each([
    [1000, 1],
    [100, 0],
    [1000.1, 1],
  ])('%s', (ms, s) => {
    expect(ms2s(ms)).toBe(s)
  })
})

describe('msUntilNextDay', () => {
  test.each([
    [new Date('2021-08-16 23:59:59.999'), 1],
    [new Date('2021-08-16 23:58:59.999'), 60001],
    [new Date('2021-08-16 00:00:00.000'), 86400000],
  ])('%s', (now, ms) => {
    expect(msUntilNextDay(now)).toBe(ms)
  })

  it('not pass now', () => {
    const ms = msUntilNextDay()
    expect(ms > 0 && ms < 86400000).toBeTruthy()
  })
})
