import { md5 } from '../src/hash'

describe('md5', () => {
  test.each([
    ['d2580841f177e844971c32b9f4bfaa5a', '3443434434'],
    ['2ec1991721b87b535a69ea963b0a6368', 'trueblue'],
    ['d8596d2a039a3547c1ae5eeb94f5a2ce', 'areeb2015'],
    ['7ddeef932b7177540ee5f99c445aa971', '986644'],
    ['f799c7725ba6830f41f0a8f886c6ff94', '13778'],
  ])('%s', (expected, str) => {
    expect(md5(str)).toBe(expected)
  })
})
