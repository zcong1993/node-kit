import { registerCloser, closeAll } from '../src/closer'
import { sleep } from './testUtils'

describe('closer', () => {
  it('should works', async () => {
    const res: string[] = []

    registerCloser(
      't1',
      async () => {
        await sleep(100)
        res.push('t1')
      },
      200
    )

    registerCloser(
      't2',
      async () => {
        await sleep(50)
        res.push('t2')
      },
      300
    )

    registerCloser(
      't3',
      async () => {
        await sleep(50)
        throw new Error('test')
      },
      300
    )

    registerCloser(
      't4',
      async () => {
        await sleep(500)
        res.push('t4')
      },
      300
    )

    await closeAll()

    expect(res).toStrictEqual(['t2', 't1'])
    // wait t4 timeout done
    await sleep(500)

    registerCloser('t5', async () => {
      await sleep(500)
      res.push('t4')
    })
  })
})
