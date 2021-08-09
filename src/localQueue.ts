import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export type LocalQueueOnError<T> = (err: LocalQueueError<T>) => void

export class LocalQueueError<T> extends Error {
  constructor(err: Error, readonly task: T, readonly queueName: string) {
    super(err.message)
    this.name = this.constructor.name
  }
}

// task with meta, placeholder
export interface Task<T> {
  data: T
}

/**
 * local queue base on rxjs, support concurrent control
 */
export class LocalQueue<T> {
  private _processed: number = 0
  private started: boolean = false
  private buffered: T[] = []
  private readonly subject = new Subject<Task<T>>()

  constructor(
    private readonly queueName: string,
    private readonly concurrent: number = 20,
    private readonly onError: LocalQueueOnError<Task<T>> = () => {}
  ) {}

  push(data: T) {
    if (!this.started) {
      this.buffered.push(data)
    } else {
      this.subject.next({ data })
    }
  }

  startProcess(fn: (data: T, task?: Task<T>) => Promise<any>) {
    const p = new Promise<void>((resolve) => {
      this.subject
        .pipe(
          mergeMap(async (task) => {
            try {
              await fn(task.data, task)
            } catch (err) {
              this.onError(new LocalQueueError(err, task, this.queueName))
            } finally {
              this._processed++
            }
          }, this.concurrent)
        )
        .subscribe({
          complete: () => {
            resolve()
          },
        })
    })

    this.started = true
    this.buffered.map((data) => this.subject.next({ data }))
    this.buffered = []

    return p
  }

  complete() {
    this.subject.complete()
  }

  get processed() {
    return this._processed
  }
}
