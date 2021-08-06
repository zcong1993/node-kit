import { parsePagnation, parsePagnationOffsetLimit } from '../src/pagnation'

describe('parsePagnation', () => {
  test.each([
    [
      {
        current: '1',
        pageSize: '9',
      },
      { offset: 0, limit: 9 },
    ],
    [
      {
        current: '-1',
        pageSize: '-9',
      },
      { offset: 0, limit: 1 },
    ],
    [
      {
        current: 'sss',
        pageSize: 'a',
      },
      { offset: 0, limit: 100 },
    ],
    [{}, { offset: 0, limit: 100 }],
  ])('%p', (a, b) => {
    expect(parsePagnation(a)).toStrictEqual(b)
  })

  it('custom default limit', () => {
    expect(parsePagnation({}, 10)).toStrictEqual({ offset: 0, limit: 10 })
  })
})

describe('parsePagnationOffsetLimit', () => {
  test.each([
    [
      {
        offset: '1',
        limit: '9',
      },
      { offset: 1, limit: 9 },
    ],
    [
      {
        offset: '-1',
        limit: '-9',
      },
      { offset: 0, limit: 1 },
    ],
    [
      {
        offset: 'xx',
        limit: 'xx',
      },
      { offset: 0, limit: 100 },
    ],
    [{}, { offset: 0, limit: 100 }],
  ])('%p', (a, b) => {
    expect(parsePagnationOffsetLimit(a)).toStrictEqual(b)
  })

  it('custom default limit', () => {
    expect(parsePagnationOffsetLimit({}, 10)).toStrictEqual({
      offset: 0,
      limit: 10,
    })
  })
})
