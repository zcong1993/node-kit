import { toFormatString, fromFormatString } from '../src/time'

describe('date format', () => {
  it('default format', () => {
    const d = new Date(2021, 10, 30, 0, 0, 0, 0)
    const str = toFormatString(d)
    expect(str).toBe('2021-11-30 00:00:00')
    expect(fromFormatString(str)).toStrictEqual(d)
  })

  it('custom format', () => {
    const d = new Date(2021, 10, 30, 0, 0, 0, 0)
    const format = 'yyyy-MM-dd'
    const str = toFormatString(d, format)
    expect(str).toBe('2021-11-30')
    expect(fromFormatString(str, format)).toStrictEqual(d)
  })
})
