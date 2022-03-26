import type { LoggerService as ILoggerService, LogLevel } from '@nestjs/common'
export type LoggerService = ILoggerService

/* eslint-disable @typescript-eslint/no-unused-vars */
/* c8 ignore start */
export class NoopLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]): any {}
  error(message: any, ...optionalParams: any[]): any {}
  warn(message: any, ...optionalParams: any[]): any {}
  debug?(message: any, ...optionalParams: any[]): any {}
  verbose?(message: any, ...optionalParams: any[]): any {}
  setLogLevels?(levels: LogLevel[]): any {}
}
/* c8 ignore stop */
