import { TokenLimiter } from '../../src/limiter/tokenLimit'
import { sleep, setupRedis, repeatCall } from '../testUtils'

let redis: any
let close: Function

describe('TokenLimiter', () => {
  beforeAll(async () => {
    ;[redis, close] = setupRedis()
    await redis.flushdb()
  })

  afterAll(() => {
    close()
  }, 10000)

  it('test allow', async () => {
    const total = 100
    const rate = 5
    const burst = 10

    const tl = new TokenLimiter({
      redis,
      keyPrefix: 'TokenLimiter',
      rate,
      burst,
    })

    let allow = 0

    for (let i = 0; i < total; i++) {
      await sleep(1000 / total)
      if (await tl.allow('test')) {
        allow++
      }
    }

    expect(allow >= burst + rate).toBeTruthy()
  })

  it('test burst', async () => {
    const total = 100
    const rate = 5
    const burst = 10

    const tl = new TokenLimiter({
      redis,
      keyPrefix: 'TokenLimiter2',
      rate,
      burst,
    })

    let allow = 0

    await repeatCall(total, async () => {
      if (await tl.allow('test2')) {
        allow++
      }
    })

    expect(allow >= burst).toBeTruthy()
  })

  it('test invalid n', async () => {
    const rate = 5
    const burst = 10

    const tl = new TokenLimiter({
      redis,
      keyPrefix: 'TokenLimiter2',
      rate,
      burst,
    })

    await expect(() => tl.allowN('test3', -10)).rejects.toThrow()
  })
})
