import { loadPackageOnce } from './loadPackage'

const loadDateFns = () => loadPackageOnce('date-fns', 'node-kit time')

export const simpleFormat = 'yyyy-MM-dd HH:mm:ss'

export const toFormatString = (d: Date, format = simpleFormat): string => {
  const dateFns = loadDateFns()
  return dateFns.format(d, format)
}

export const fromFormatString = (str: string, format = simpleFormat): Date => {
  const dateFns = loadDateFns()
  return dateFns.parse(str, format, new Date())
}
