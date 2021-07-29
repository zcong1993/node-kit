import { setTimeout } from 'timers/promises'

export const delayFn =
  <T>(timeout: number, res: T) =>
  async () => {
    await setTimeout(timeout)
    return res
  }

export const intRange = (num: number, start = 0) =>
  Array(num)
    .fill(null)
    .map((_, i) => i + start)
