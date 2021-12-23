import type {
  Secret,
  GetPublicKeyOrSecret,
  VerifyOptions,
  SignOptions,
} from 'jsonwebtoken'
import { loadPackage } from './loadPackage'

export interface SimpleJWTOption {
  secret: string
  signOptions?: SignOptions
}

export class SimpleJWT<T extends object = any> {
  private readonly jsonwebtoken: any
  constructor(private readonly options: SimpleJWTOption) {
    this.jsonwebtoken = loadPackage('jsonwebtoken', 'SimpleJWT')
  }

  async sign(payload: T) {
    return this.originSign<T>(
      payload,
      this.options.secret,
      this.options.signOptions
    )
  }

  async verify(token: string) {
    return this.originVerify<T>(token, this.options.secret)
  }

  originVerify<T = any>(
    token: string,
    secretOrPublicKey: Secret | GetPublicKeyOrSecret
  ): Promise<T>
  originVerify<T = any>(
    token: string,
    secretOrPublicKey: Secret | GetPublicKeyOrSecret,
    options?: VerifyOptions & { complete: true }
  ): Promise<T>
  originVerify<T = any>(
    token: string,
    secretOrPublicKey: Secret | GetPublicKeyOrSecret,
    options?: VerifyOptions
  ): Promise<T>
  originVerify<T = any>(
    token: any,
    secretOrPublicKey: any,
    options?: any
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.jsonwebtoken.verify(
        token,
        secretOrPublicKey,
        options,
        (err: Error, resp: T) => {
          if (err) {
            reject(err)
          } else {
            resolve(resp)
          }
        }
      )
    })
  }

  originSign<T extends object = any>(
    payload: string | Buffer | T,
    secretOrPrivateKey: Secret
  ): Promise<string>
  originSign<T extends object = any>(
    payload: string | Buffer | T,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): Promise<string>
  originSign<T extends object = any>(
    payload: string | Buffer | T,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jsonwebtoken.sign(
        payload,
        secretOrPrivateKey,
        options,
        (err: Error, resp: string) => {
          /* c8 ignore next 2 */
          if (err) {
            reject(err)
          } else {
            resolve(resp)
          }
        }
      )
    })
  }
}
