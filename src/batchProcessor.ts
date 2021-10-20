export type BatchHandler<T> = (tasks: T[]) => Promise<any>

/**
 * Config for BatchProcessor
 */
export interface BatchConfig {
  /**
   * max tasks num for one batch,
   * batch processer will call batchHandler immediately
   * when forceDelay is false and queued tasks more than maxBatchSize
   */
  maxBatchSize: number
  /**
   * if forceDelay is true, BatchProcessor will act like setInterval(batchHandler(tasks), scheduledDelayMs),
   * else is max delay time when queued tasks less than  maxBatchSize
   */
  scheduledDelayMs: number
  forceDelay?: boolean
  onError?: (err: Error) => void
}

/**
 * BatchProcessor process tasks with batches
 */
export class BatchProcessor<T = any> {
  private tasks: T[] = []

  private timer: NodeJS.Timeout | undefined
  private isShutdown = false

  constructor(
    private readonly batchHandler: BatchHandler<T>,
    private readonly config: BatchConfig
  ) {}

  /**
   * add task to processor
   */
  add(task: T) {
    if (this.isShutdown) {
      return
    }
    this.tasks.push(task)
    if (
      !this.config.forceDelay &&
      this.tasks.length >= this.config.maxBatchSize
    ) {
      this.flushOneBatch().then(() => this.maybeStartTimer())
    } else {
      this.maybeStartTimer()
    }
  }

  /**
   * handle all queued tasks with batch handler concurrently
   */
  async forceFlush() {
    if (this.isShutdown) {
      return
    }
    return this.flushAll()
  }

  /**
   * marke processor as shutdown mode and call forceFlush
   */
  async shutdown() {
    if (this.isShutdown) {
      return
    }

    this.isShutdown = true
    return this.flushAll()
  }

  private async flushOneBatch(): Promise<void> {
    this.clearTimer()
    /* istanbul ignore next */
    if (this.tasks.length === 0) {
      return
    }

    try {
      await this.batchHandler(this.tasks.splice(0, this.config.maxBatchSize))
    } catch (err) {
      this.config?.onError(err)
    }
  }

  private async flushAll() {
    const promises = []
    // calculate number of batches
    const count = Math.ceil(this.tasks.length / this.config.maxBatchSize)
    for (let i = 0, j = count; i < j; i++) {
      promises.push(this.flushOneBatch())
    }
    return Promise.all(promises).then(() => Promise.resolve())
  }

  private maybeStartTimer() {
    if (this.timer !== undefined) {
      return
    }

    this.timer = setTimeout(() => {
      this.flushOneBatch().then(() => {
        if (this.tasks.length > 0) {
          this.clearTimer()
          this.maybeStartTimer()
        }
      })
    }, this.config.scheduledDelayMs)
    this.timer.unref()
  }

  private clearTimer() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }
}
