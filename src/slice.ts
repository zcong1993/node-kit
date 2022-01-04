export type OnStart = (startIndex: number, endIndex: number) => void

export class SliceError extends Error {
  constructor(
    err: Error,
    readonly startIndex: number,
    readonly endIndex: number
  ) {
    super(err.message)
    this.name = this.constructor.name
  }
}

export type SliceOnError = (error: SliceError) => void

export type SliceHandler<T, U> = (
  d: T[],
  signal?: AbortSignal
) => U | Promise<U>
export interface Option {
  signal?: AbortSignal
  onStart?: OnStart
  onError?: SliceOnError
}

/**
 * slice large array into smalls and call consumer function in serial
 * support AbortSignal cancel
 * @param dataSource - data source array
 * @param fn - handler function
 * @param partition - partition number
 * @param option - {@link Option} option
 * @returns
 */
export const sliceRun = async <T = any, U = any>(
  dataSource: T[],
  fn: SliceHandler<T, U>,
  partition: number,
  option?: Option
) => {
  const res: U[] = []
  const total = dataSource.length
  let i = 0

  if (option?.signal?.aborted) {
    return res
  }

  while (i < total) {
    if (option?.signal?.aborted) {
      return res
    }

    const startIndex = i
    const endIndex = i + partition

    let pd = dataSource.slice(startIndex, endIndex)

    if (option?.onStart) {
      option.onStart(startIndex, endIndex)
    }

    try {
      const r = await fn(pd, option?.signal)
      res.push(r)
    } catch (err) {
      if (option?.onError) {
        option.onError(new SliceError(err, startIndex, endIndex))
      }
    }
    i += pd.length
    pd = []
  }

  return res
}
