import { setTimeout as setTimeoutP } from 'timers/promises'
import {
  ms2s,
  msUntilNextDay,
  sleepPromise,
  objOnceGuard,
  isAbortError,
} from '../src/utils'
import { repeatCallSync } from './testUtils'

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

describe('sleepPromise', () => {
  it('should works', async () => {
    expect(sleepPromise(100)).toBeInstanceOf(Promise)
    await sleepPromise(50)
  })
})

describe('objOnceGuard', () => {
  it('should works', () => {
    const obj: any = {}
    const fn = vi.fn()
    const key = Symbol.for('test')

    repeatCallSync(10, () => objOnceGuard(obj, key, fn))

    expect(fn).toBeCalledTimes(1)
    expect(obj[key]).toBeTruthy()
  })
})

describe('isAbortError', () => {
  it('should works', async () => {
    const ac = new AbortController()
    setTimeout(() => ac.abort(), 100)
    let e: Error

    try {
      await setTimeoutP(1000, null, { signal: ac.signal })
    } catch (err) {
      e = err
    }

    expect(isAbortError(e)).toBeTruthy()

    expect(isAbortError(new Error())).toBeFalsy()
  })
})
