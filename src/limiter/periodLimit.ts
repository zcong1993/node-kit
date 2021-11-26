import type { Redis } from 'ioredis'
import { buildKey } from '../string'
import { objOnceGuard } from '../utils'

const periodScriptKey = Symbol.for('node-kit periodScriptKey')

const addPeriodScriptCommand = (redis: Redis) => {
  objOnceGuard(redis, periodScriptKey, () => {
    redis.defineCommand('periodLimit', {
      numberOfKeys: 1,
      lua: `local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local current = redis.call("INCRBY", KEYS[1], 1)
if current == 1 then
    redis.call("expire", KEYS[1], window)
    return 1
elseif current < limit then
    return 1
elseif current == limit then
    return 2
else
    return 0
end`,
    })
  })
}

interface ExtRedis extends Redis {
  periodLimit(key: string, limit: string, window: string): Promise<number>
}

export interface PeriodLimiterOption {
  redis: Redis
  period: number
  quota: number
  keyPrefix: string
}

export enum PeriodLimiterState {
  Allowed = 1,
  HitQuota = 2,
  OverQuota = 3,
}

export class PeriodLimiter {
  private redis: ExtRedis
  constructor(private readonly option: PeriodLimiterOption) {
    addPeriodScriptCommand(option.redis)
    this.redis = option.redis as ExtRedis
  }

  /**
   * Take requests a permit, it returns the permit state.
   * @param key - key group
   * @returns [canPass, stateDetail]
   */
  async take(key: string): Promise<[boolean, PeriodLimiterState]> {
    const realKey = buildKey([this.option.keyPrefix, key])
    const resp = await this.redis.periodLimit(
      realKey,
      `${this.option.quota}`,
      `${this.option.period}`
    )
    switch (resp) {
      case 0:
        return [false, PeriodLimiterState.OverQuota]
      case 1:
        return [true, PeriodLimiterState.Allowed]
      case 2:
        return [true, PeriodLimiterState.HitQuota]
      /* istanbul ignore next */
      default:
        throw new Error('invalid code')
    }
  }
}
