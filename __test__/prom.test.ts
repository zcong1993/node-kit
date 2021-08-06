import type { Server } from 'http'
import { Registry } from 'prom-client'
import supertest from 'supertest'
import { serveMetrics } from '../src/prom'

describe('serveMetrics', () => {
  let server: Server
  afterEach(() => {
    server.close()
  })

  it('default options', async () => {
    server = await serveMetrics(3001)
    const request = supertest(server)
    const res = await request.get('/metrics')
    expect(res.status).toBe(200)

    expect((await request.get('/')).status).toBe(404)
  })

  it('custom metrics path', async () => {
    server = await serveMetrics(3002, '/appMetrics')
    const request = supertest(server)
    const res = await request.get('/appMetrics')
    expect(res.status).toBe(200)

    expect((await request.get('/metrics')).status).toBe(404)
  })

  it('custom registry', async () => {
    const r = new Registry()
    server = await serveMetrics(3003, undefined, r)
    const request = supertest(server)
    const res = await request.get('/metrics')
    expect(res.status).toBe(200)

    expect((await request.get('/')).status).toBe(404)
  })
})
