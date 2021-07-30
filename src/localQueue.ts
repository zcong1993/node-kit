import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export type LocalQueueOnError<T> = (
  err: Error,
  task: T,
  queueName: string
) => void

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
  private readonly subject = new Subject<Task<T>>()

  constructor(
    private readonly queueName: string,
    private readonly concurrent: number = 20,
    private readonly onError: LocalQueueOnError<Task<T>> = () => {}
  ) {}

  push(data: T) {
    if (!this.started) {
      throw new Error('call startProcess before push')
    }
    this.subject.next({ data })
  }

  startProcess(fn: (data: T, task?: Task<T>) => Promise<any>) {
    this.started = true
    return new Promise<void>((resolve) => {
      this.subject
        .pipe(
          mergeMap(async (task) => {
            try {
              await fn(task.data, task)
            } catch (err) {
              this.onError(err, task, this.queueName)
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
  }

  complete() {
    this.subject.complete()
  }

  get processed() {
    return this._processed
  }
}
