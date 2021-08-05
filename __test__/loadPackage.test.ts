import { loadPackage } from '../src/loadPackage'

describe('loadPackage', () => {
  it('should return package', () => {
    expect(loadPackage('@zcong/singleflight', 'test')).toStrictEqual(
      require('@zcong/singleflight')
    )
    expect(
      loadPackage('@zcong/singleflight', 'test', () =>
        require('@zcong/singleflight')
      )
    ).toStrictEqual(require('@zcong/singleflight'))
  })
})
