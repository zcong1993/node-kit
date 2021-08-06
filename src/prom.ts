import http, { Server } from 'http'
import type { Registry } from 'prom-client'
import { loadPackage } from './loadPackage'

export const serveMetrics = async (
  port: number,
  metricsPath: string = '/metrics',
  registry?: Registry
) => {
  if (!registry) {
    registry = loadPackage('prom-client', 'serveMetrics').register
  }

  const server = http.createServer(async (req, res) => {
    if (req.url !== metricsPath) {
      res.writeHead(404)
      res.end()
      return
    }

    res.setHeader('Content-Type', registry.contentType)
    res.end(await registry.metrics())
  })

  return new Promise<Server>((resolve) => {
    server.listen(port, () => {
      console.log(`serve metrics on http://localhost:${port}${metricsPath}`)
      resolve(server)
    })
  })
}
