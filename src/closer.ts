import { sleepPromise } from './utils'

/**
 * Closer is a simple closer promise function
 */
export type Closer = () => Promise<void>

const DEFAULT_TIMEOUT = 1000

interface CloserWithTimeout {
  name: string
  closer: Closer
  timeout: number
}

const store = new Map<string, CloserWithTimeout>()

/**
 * register a closer
 * @param name - closer name, used in error log
 * @param closer - closer to close
 * @param timeout - timeout ms, default is 1000ms
 */
export const registerCloser = (
  name: string,
  closer: Closer,
  timeout: number = DEFAULT_TIMEOUT
) => {
  store.set(name, {
    name,
    closer,
    timeout,
  })
}

/**
 * run all registered closer functions in parallel
 * @returns
 */
export const closeAll = async () =>
  Promise.all(
    [...store.values()].map((ct) =>
      Promise.race([
        ct.closer().catch((err) => {
          console.warn(`closer ${ct.name} error: `, err)
        }),
        sleepPromise(ct.timeout),
      ])
    )
  )
