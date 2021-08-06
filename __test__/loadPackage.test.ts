import { loadPackage, loadPackageOnce } from '../src/loadPackage'

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

describe('loadPackageOnce', () => {
  it('should only load once', () => {
    const loadFn = jest
      .fn()
      .mockImplementation(() => require('@zcong/singleflight'))
    expect(
      loadPackageOnce('@zcong/singleflight', 'test', loadFn)
    ).toStrictEqual(require('@zcong/singleflight'))

    expect(
      loadPackageOnce('@zcong/singleflight', 'test', loadFn)
    ).toStrictEqual(require('@zcong/singleflight'))

    expect(loadFn).toBeCalledTimes(1)
  })
})
