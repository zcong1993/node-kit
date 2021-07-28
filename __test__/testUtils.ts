import { setTimeout } from 'timers/promises'

export const delayFn =
  <T>(timeout: number, res: T) =>
  async () => {
    await setTimeout(timeout)
    return res
  }
