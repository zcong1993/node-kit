import type Redis from 'ioredis'
import { buildKey } from '../string'
import { objOnceGuard } from '../utils'

const tokenScriptKey = Symbol.for('node-kit tokenScriptKey')

const addTokenScriptCommand = (redis: Redis) => {
  objOnceGuard(redis, tokenScriptKey, () => {
    redis.defineCommand('tokenLimit', {
      numberOfKeys: 2,
      lua: `local rate = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])
local fill_time = capacity/rate
local ttl = math.floor(fill_time*2)
local last_tokens = tonumber(redis.call("get", KEYS[1]))
if last_tokens == nil then
    last_tokens = capacity
end
local last_refreshed = tonumber(redis.call("get", KEYS[2]))
if last_refreshed == nil then
    last_refreshed = 0
end
local delta = math.max(0, now-last_refreshed)
local filled_tokens = math.min(capacity, last_tokens+(delta*rate))
local allowed = filled_tokens >= requested
local new_tokens = filled_tokens
if allowed then
    new_tokens = filled_tokens - requested
end
redis.call("setex", KEYS[1], ttl, new_tokens)
redis.call("setex", KEYS[2], ttl, now)
return allowed`,
    })
  })
}

interface ExtRedis extends Redis {
  tokenLimit(
    tokenKey: string,
    timestampKey: string,
    rate: string,
    burst: string,
    now: string,
    requested: string
  ): Promise<number>
}

export interface TokenLimiterOption {
  redis: Redis
  rate: number
  burst: number
  keyPrefix: string
}

const tokenKeySuffix = 'token'
const timestampKeySuffix = 'ts'

// go-zero tokenlimit
// https://github.com/zeromicro/go-zero/blob/c800f6f723cfab236e4caf8f9ae7f066d10bc90f/core/limit/tokenlimit.go
export class TokenLimiter {
  private redis: ExtRedis

  constructor(private readonly option: TokenLimiterOption) {
    addTokenScriptCommand(option.redis)
    this.redis = option.redis as ExtRedis
  }

  async allow(key: string) {
    return this.allowN(key, 1)
  }

  async allowN(key: string, n: number) {
    const num = Math.floor(n)
    if (num < 1) {
      throw new Error('invalid n')
    }

    const [tokenKey, timestampKey] = this.buildKeys(key)

    const res = await this.redis.tokenLimit(
      tokenKey,
      timestampKey,
      `${this.option.rate}`,
      `${this.option.burst}`,
      `${TokenLimiter.nowS()}`,
      `${n}`
    )
    return res === 1
  }

  buildKeys(key: string): [tokenKey: string, timestampKey: string] {
    return [
      buildKey([this.option.keyPrefix, key, tokenKeySuffix]),
      buildKey([this.option.keyPrefix, key, timestampKeySuffix]),
    ]
  }

  static nowS() {
    return Math.floor(Date.now() / 1000)
  }
}
