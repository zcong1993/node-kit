export type PipeErrorFactory = (err: string) => any

export const defaultErrorFactory: PipeErrorFactory = (err) => new Error(err)

export const parseIntPipe = (
  value: string,
  pipeErrorFactory: PipeErrorFactory = defaultErrorFactory
) => {
  const isNumeric =
    ['string', 'number'].includes(typeof value) &&
    !isNaN(parseFloat(value)) &&
    isFinite(value as any)
  if (!isNumeric) {
    throw pipeErrorFactory('Validation failed (numeric string is expected)')
  }
  return parseInt(value, 10)
}

export const parseFloatPipe = (
  value: string,
  pipeErrorFactory: PipeErrorFactory = defaultErrorFactory
) => {
  const isNumeric =
    ['string', 'number'].includes(typeof value) &&
    !isNaN(parseFloat(value)) &&
    isFinite(value as any)
  if (!isNumeric) {
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
