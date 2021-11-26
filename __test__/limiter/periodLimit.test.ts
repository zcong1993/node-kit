import {
  PeriodLimiter,
  PeriodLimiterState,
} from '../../src/limiter/periodLimit'
import { repeatCall, setupRedis } from '../testUtils'

let redis: any
let close: Function

describe('PeriodLimiter', () => {
  beforeAll(async () => {
    ;[redis, close] = setupRedis()
    await redis.flushdb()
  })

  afterAll(() => {
    close()
  }, 10000)

  it('should works', async () => {
    const quota = 5
    const pl = new PeriodLimiter({
      redis,
      keyPrefix: 'test',
      period: 1,
      quota,
    })

    const total = 100

    const tmpArr: number[] = Array(4).fill(0)

    let pass = 0

    await repeatCall(total, async () => {
      const res = await pl.take('test')
      tmpArr[res[1]]++
      if (res[0]) {
        pass++
      }
    })

    expect(tmpArr[PeriodLimiterState.Allowed]).toBe(quota - 1)
    expect(tmpArr[PeriodLimiterState.HitQuota]).toBe(1)
    expect(tmpArr[PeriodLimiterState.OverQuota]).toBe(total - quota)
    expect(pass).toBe(quota)
  })
})
