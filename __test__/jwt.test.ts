import { SimpleJWT } from '../src/jwt'

interface Payload {
  uid: string
}

describe('SimpleJWT', () => {
  const sj1 = new SimpleJWT<Payload>({
    secret: 'test1',
    signOptions: {
      expiresIn: '1d',
    },
  })

  const sj2 = new SimpleJWT<Payload>({
    secret: 'test2',
    signOptions: {
      expiresIn: '1d',
    },
  })

  const payload1: Payload = { uid: 'xxx1' }

  let token1: string

  it('should works well', async () => {
    token1 = await sj1.sign(payload1)
    expect(await sj1.verify(token1)).toMatchObject(payload1)
  })

  it('wrong secret should throw', async () => {
    await expect(() => sj2.verify(token1)).rejects.toThrow()
  })
})
