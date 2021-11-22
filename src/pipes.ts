import type { ClassTransformOptions } from 'class-transformer'
import type { ValidationError, ValidatorOptions } from 'class-validator'
import { iterate } from 'iterare'
import { loadPackageOnce } from './loadPackage'
import { isNumeric } from './string'

export type PipeErrorFactory = (err: string) => any

export const defaultErrorFactory: PipeErrorFactory = (err) => new Error(err)

export const parseIntPipe = (
  value: string,
  pipeErrorFactory: PipeErrorFactory = defaultErrorFactory
) => {
  if (!isNumeric(value)) {
    throw pipeErrorFactory('Validation failed (numeric string is expected)')
  }
  return parseInt(value, 10)
}

export const parseFloatPipe = (
  value: string,
  pipeErrorFactory: PipeErrorFactory = defaultErrorFactory
) => {
  if (!isNumeric(value)) {
    throw pipeErrorFactory('Validation failed (numeric string is expected)')
  }
  return parseFloat(value)
}

export const parseBoolPipe = (
  value: string | boolean,
  pipeErrorFactory: PipeErrorFactory = defaultErrorFactory
) => {
  if (value === true || value === 'true') {
    return true
  }
  if (value === false || value === 'false') {
    return false
  }
  throw pipeErrorFactory('Validation failed (boolean string is expected)')
}

export const parseEnumPipe = <T = any>(
  enumType: T,
  value: any,
  pipeErrorFactory: PipeErrorFactory = defaultErrorFactory
) => {
  const enumValues = Object.keys(enumType).map(
    (item) => (enumType as any)[item]
  )
  const isEnum = enumValues.indexOf(value) >= 0

  if (!isEnum) {
    throw pipeErrorFactory('Validation failed (enum string is expected)')
  }

  return value
}

export type Class<T = unknown, Arguments extends any[] = any[]> = new (
  ...arguments_: Arguments
) => T
export interface ValidationPipeOptions {
  transform?: boolean
  disableErrorMessages?: boolean
  transformOptions?: ClassTransformOptions
  validatorOptions?: ValidatorOptions
  exceptionFactory?: (errors: ValidationError[]) => any
}
export const isNil = (obj: any): obj is null | undefined =>
  obj === undefined || obj === null

const toEmptyIfNil = <T = any, R = any>(value: T): R | {} => {
  return isNil(value) ? {} : value
}

const stripProtoKeys = (value: Record<string, any>) => {
  delete value.__proto__
  const keys = Object.keys(value)
  iterate(keys)
    .filter((key) => typeof value[key] === 'object' && value[key])
    .forEach((key) => stripProtoKeys(value[key]))
}

export const validationPipe = <T>(
  Cls: Class<T>,
  value: any,
  option: ValidationPipeOptions = {}
): T => {
  const classValidator: any = loadPackageOnce(
    'class-validator',
    'validationPipe'
  )
  const classTransformer: any = loadPackageOnce(
    'class-transformer',
    'validationPipe'
  )

  if (!option.exceptionFactory) {
    option.exceptionFactory = (errors) =>
      new Error(`${errors.map((e) => e.toString())}`)
  }

  const types = [String, Boolean, Number, Array, Object, Buffer]
  const toValidate = !types.some((t) => (Cls as any) === t) && !isNil(Cls)

  if (!Cls || !toValidate) {
    return value
  }

  const originalValue = value
  value = toEmptyIfNil(value)
  const isNil1 = value !== originalValue

  if (isNil1) {
    return originalValue
  }

  stripProtoKeys(value)

  const entity = classTransformer.plainToInstance(
    Cls,
    value,
    option.transformOptions
  )

  const errors = classValidator.validateSync(
    entity as any,
    option.validatorOptions
  )
  if (errors.length > 0) {
    throw option.exceptionFactory(errors)
  }

  if (option.transform) {
    return entity
  }

  return option.validatorOptions &&
    Object.keys(option.validatorOptions).length > 0
    ? classTransformer.instanceToPlain(entity, option.transformOptions)
    : value
}
