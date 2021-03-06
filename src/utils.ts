const ONE_DAY_IN_MS = 86400 * 1000
const ONE_SECOND_IN_MS = 1000

/**
 * calculate number of seconds until the next day
 * @param now - now time, default is new Date()
 * @returns duration in ms
 */
export const msUntilNextDay = (now: Date = new Date()) => {
  const nowTime = now.getTime()
  const nextStartDay = now.setHours(0, 0, 0, 0) + ONE_DAY_IN_MS
  return nextStartDay - nowTime
}

/**
 * convert ms to s, Math.floor
 * @param ms - millsecond
 * @returns second
 */
export const ms2s = (ms: number) => Math.floor(ms / ONE_SECOND_IN_MS)

/**
 * helper function for sleep a moment
 * @param ms - millsecond
 * @returns
 */
export const sleepPromise = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms))

export const objOnceGuard = <T extends object>(
  obj: T,
  key: symbol,
  fn: () => void
) => {
  if ((obj as any)[key]) {
    return
  }

  ;(obj as any)[key] = true
  fn()
}

// https://github.com/nodejs/node/issues/36084#issuecomment-729894622
export const isAbortError = (err?: Error) => err?.name === 'AbortError'
