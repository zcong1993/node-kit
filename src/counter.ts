import type { Redis } from 'ioredis'
import _ from 'lodash'

export class Counter {
  constructor(
    private readonly redis: Redis,
    private readonly groupKey: string
  ) {}

  async incrOrSet(field: string, num: number, initialNum: number) {
    if (!(await this.exists(field))) {
      return this.set(field, initialNum + num)
    } else {
      return this.incr(field, num)
    }
  }

  async incrOrSetLazyload(
    field: string,
    num: number,
    initialNumGetter: () => Promise<number>
  ) {
    if (!(await this.exists(field))) {
      const initialNum = await initialNumGetter()
      return this.set(field, initialNum + num)
    } else {
      return this.incr(field, num)
    }
  }

  async incr(field: string, num: number) {
    return this.redis.hincrby(this.groupKey, field, num)
  }

  async getOne(field: string, defaultVal: number = 0) {
    const val = await this.redis.hget(this.groupKey, field)
    const vv = val ?? defaultVal
    return parseInt(vv as string, 10)
  }

  async getAll() {
    return this.redis.hgetall(this.groupKey)
  }

  async set(field: string, num: number) {
    return this.redis.hset(this.groupKey, field, num)
  }

  async exists(field: string) {
    return this.redis.hexists(this.groupKey, field)
  }

  async delete(field: string) {
    return this.redis.hdel(this.groupKey, field)
  }

  /**
   * merge redis counters to records array as a field
   * @param records - dest records array
   * @param counters - redis getAll result
   * @param destField - count field receiver
   * @param idGetterFn - get the matcher key from record
   * @param defaultCount - default value for non exists count
   */
  mergeTo<T extends {}>(
    records: T[],
    counters: Record<string, string>,
    destField: string,
    idGetterFn: (record: T) => string,
    defaultCount = 0
  ) {
    records.forEach((r) => {
      const key = idGetterFn(r)
      if (counters[key]) {
        _.set(r, destField, parseInt(counters[key], 10))
      } else {
        _.set(r, destField, defaultCount)
      }
    })
  }

  /**
   * alias for getAll and mergeTo
   */
  async getAndMergeTo<T>(
    records: T[],
    destField: string,
    idGetterFn: (record: T) => string,
    defaultCount = 0
  ) {
    const counters = await this.getAll()
    this.mergeTo(records, counters, destField, idGetterFn, defaultCount)
  }
}
