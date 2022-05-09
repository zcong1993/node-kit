## [0.16.1](https://github.com/zcong1993/node-kit/compare/v0.16.0...v0.16.1) (2022-05-09)

# [0.16.0](https://github.com/zcong1993/node-kit/compare/v0.15.1...v0.16.0) (2022-01-04)

### Features

- **aggregator:** add aggregatorWithAbort, support AbortController ([fd4b7e9](https://github.com/zcong1993/node-kit/commit/fd4b7e9243aebe5b7816ff72eb8cbd4845661a59))

## [0.15.1](https://github.com/zcong1993/node-kit/compare/v0.15.0...v0.15.1) (2021-12-10)

# [0.15.0](https://github.com/zcong1993/node-kit/compare/v0.14.0...v0.15.0) (2021-12-10)

### Features

- add redis bloom ([9ceb622](https://github.com/zcong1993/node-kit/commit/9ceb6222280e8de1907349745cdc7b1c0020bf44))
- add simple date format helpers ([be05884](https://github.com/zcong1993/node-kit/commit/be05884e8062a02cf020dca7ec590ed5ba600ca4))

# [0.14.0](https://github.com/zcong1993/node-kit/compare/v0.13.1...v0.14.0) (2021-11-26)

### Features

- add periodLimit ([221bbc3](https://github.com/zcong1993/node-kit/commit/221bbc36025dada39e2cc0b71ba1bd8f3d31fab0))
- add token limit ([1971068](https://github.com/zcong1993/node-kit/commit/197106830b5e804078a0e60baff98575fb4b820a))

## [0.13.1](https://github.com/zcong1993/node-kit/compare/v0.13.0...v0.13.1) (2021-11-22)

### Bug Fixes

- expose batchProcessor ([abc1071](https://github.com/zcong1993/node-kit/commit/abc10712677b0fde6cabf7c54ba05abdbcd32a39))
- jwt deps import ([45f1e58](https://github.com/zcong1993/node-kit/commit/45f1e586db23e5cf674f2648de99344246ffdbe4))

### Features

- add base64 encode and decode ([8bb9496](https://github.com/zcong1993/node-kit/commit/8bb9496cac982e41e0976814ad23737bc857549f))
- add hex encode decode ([7609be7](https://github.com/zcong1993/node-kit/commit/7609be7130b6821a54596a8d0aa1889dca66e00f))
- add sha256, fix [#21](https://github.com/zcong1993/node-kit/issues/21) ([078cfb4](https://github.com/zcong1993/node-kit/commit/078cfb44deb06423050c1a7c59b8199d015171e2))
- batchProcessor ([dbfab90](https://github.com/zcong1993/node-kit/commit/dbfab9016996c9ba688a069fe8d5b5d38ae0e062))

# [0.13.0](https://github.com/zcong1993/node-kit/compare/v0.12.0...v0.13.0) (2021-10-15)

### Features

- **crypto:** add golang compatable aes cbc ([d4fbb41](https://github.com/zcong1993/node-kit/commit/d4fbb4192223180c6edeb952d81d642cf68e3ed2))
- **crypto:** add golang compatable aes cfb ([21b0483](https://github.com/zcong1993/node-kit/commit/21b0483510de58a956c52174caa4c7d1af2a9153))
- **crypto:** add golang compatable aes ctr ([beceb0c](https://github.com/zcong1993/node-kit/commit/beceb0cd3f9f032bc2bb4d54fab62a989f682aa2))
- **crypto:** add golang compatable aes gcm ([66e6ce0](https://github.com/zcong1993/node-kit/commit/66e6ce05e215f840ac13d1802a4145f75fee9777))
- unstableDeviation ([dffaafa](https://github.com/zcong1993/node-kit/commit/dffaafaef76518ffad70bf75970cda027c584f8c))

# [0.12.0](https://github.com/zcong1993/node-kit/compare/v0.11.0...v0.12.0) (2021-10-11)

### Features

- add jwt wrapper ([34cccc2](https://github.com/zcong1993/node-kit/commit/34cccc2877d14187cc272f2124c11cb8f730892f))

# [0.11.0](https://github.com/zcong1993/node-kit/compare/v0.10.1...v0.11.0) (2021-10-08)

### Features

- redis counter ([696c8fc](https://github.com/zcong1993/node-kit/commit/696c8fc2129a5152782c91ee553801a99d25a9bf))

## [0.10.1](https://github.com/zcong1993/node-kit/compare/v0.10.0...v0.10.1) (2021-09-23)

# [0.10.0](https://github.com/zcong1993/node-kit/compare/v0.9.4...v0.10.0) (2021-09-22)

### Features

- **redisLock:** add runWithLockLimit and tweak runWithMutex ([8b7a3bd](https://github.com/zcong1993/node-kit/commit/8b7a3bd3d1e8443a9404ef97dea2f9f3746c00bc))

### BREAKING CHANGES

- **redisLock:** runWithMutex will throw error NotGetLockError when not get lock not return null.

## [0.9.4](https://github.com/zcong1993/node-kit/compare/v0.9.3...v0.9.4) (2021-09-07)

## [0.9.3](https://github.com/zcong1993/node-kit/compare/v0.9.2...v0.9.3) (2021-09-06)

### Bug Fixes

- declare missing optional peerDependencies ([8b89cdb](https://github.com/zcong1993/node-kit/commit/8b89cdb3acbc1c00bc8e68885c6b0931a28ad72f))

## [0.9.2](https://github.com/zcong1993/node-kit/compare/v0.9.1...v0.9.2) (2021-09-03)

## [0.9.1](https://github.com/zcong1993/node-kit/compare/v0.9.0...v0.9.1) (2021-08-18)

### Bug Fixes

- **cache:** cacher param support getter function ([a8e7738](https://github.com/zcong1993/node-kit/commit/a8e77387386cf6576f6bdc27430b09aaa82a8160))

# [0.9.0](https://github.com/zcong1993/node-kit/compare/v0.8.0...v0.9.0) (2021-08-18)

### Features

- add closer manager ([7401fd1](https://github.com/zcong1993/node-kit/commit/7401fd13864070bbcba2806b1800d95860b6050d))
- add env helpers ([bf8468e](https://github.com/zcong1993/node-kit/commit/bf8468e4e2da650de10a2120a3db372e64fadb2e))

# [0.8.0](https://github.com/zcong1993/node-kit/compare/v0.7.0...v0.8.0) (2021-08-16)

### Bug Fixes

- export Picker interface ([f940a78](https://github.com/zcong1993/node-kit/commit/f940a789c67e1a038dd959149617e74397fdbc20))
- release commonjs ([ecd5226](https://github.com/zcong1993/node-kit/commit/ecd52262349f7eaa73dfec92ae304f3db99c154c))

### Features

- **array:** add array unique ([e3453f0](https://github.com/zcong1993/node-kit/commit/e3453f0c210d921c6babb10510cc5eb7a552d4c7))
- **cache:** add cache decorator ([60de3dd](https://github.com/zcong1993/node-kit/commit/60de3dd2d5dcdef43d3ea3d675aebb00daa347b4))
- **picker:** add pickers ([ed9c52a](https://github.com/zcong1993/node-kit/commit/ed9c52af8c3d452266a7aaaaedeeb38177c8a6a8))
- **utils:** add msUntilNextDay and ms2s ([f67ffd6](https://github.com/zcong1993/node-kit/commit/f67ffd6d3f59bd801dd8fca9bea4b4e6fca85690))

# [0.7.0](https://github.com/zcong1993/node-kit/compare/v0.6.2...v0.7.0) (2021-08-11)

### Features

- **crypto:** add md5 and AesCipher ([efdd95e](https://github.com/zcong1993/node-kit/commit/efdd95ea63359e71153dfba1e878d53b95c66113))
- **rand:** add randRange ([f5a1acf](https://github.com/zcong1993/node-kit/commit/f5a1acf796030cf4b9bfb3afd1751f782a01a4b1))

## [0.6.2](https://github.com/zcong1993/node-kit/compare/v0.6.1...v0.6.2) (2021-08-10)

# [0.6.0](https://github.com/zcong1993/node-kit/compare/v0.5.1...v0.6.0) (2021-08-09)

### Features

- add isNumeric parseIntOrDefault and parseFloatOrDefault ([a54dcc3](https://github.com/zcong1993/node-kit/commit/a54dcc3e689427e2c0b2ccade16232e7e487b5e6))
- add pagnation helpers ([51b83ed](https://github.com/zcong1993/node-kit/commit/51b83ed28dc3807867be7d3afd32e7ca74d7ce6c))
- use @microsoft/api-extractor make export types more friendly ([#11](https://github.com/zcong1993/node-kit/issues/11)) ([d0e3c08](https://github.com/zcong1993/node-kit/commit/d0e3c0815f901b21e8847b8c78180ae188686297))

## [0.5.1](https://github.com/zcong1993/node-kit/compare/v0.5.0...v0.5.1) (2021-08-06)

### Bug Fixes

- export prom ([79935cc](https://github.com/zcong1993/node-kit/commit/79935cc0b63e2256a6c802a21bc576a609aeb3d7))

# [0.5.0](https://github.com/zcong1993/node-kit/compare/v0.4.0...v0.5.0) (2021-08-06)

### Features

- add loadPackageOnce ([ec7fde6](https://github.com/zcong1993/node-kit/commit/ec7fde6640b8fd9253aaeb7c4c06b46952aa52af))
- add serveMetrics ([ad05fca](https://github.com/zcong1993/node-kit/commit/ad05fca58d7639054c392934493402c21c46cd88))

# [0.4.0](https://github.com/zcong1993/node-kit/compare/v0.3.0...v0.4.0) (2021-08-06)

### Features

- add validation pipe ([#7](https://github.com/zcong1993/node-kit/issues/7)) ([39c5388](https://github.com/zcong1993/node-kit/commit/39c538808ebca75e67f070e07f20491f5955deda))

# [0.3.0](https://github.com/zcong1993/node-kit/compare/v0.2.1...v0.3.0) (2021-08-05)

### Features

- add loadPackage ([f05bf70](https://github.com/zcong1993/node-kit/commit/f05bf709fb09e31ab01733e3a1dec9ebca8243d1))

# [0.2.0](https://github.com/zcong1993/node-kit/compare/v0.1.1...v0.2.0) (2021-08-05)

### Features

- add pipe ([ba618a3](https://github.com/zcong1993/node-kit/commit/ba618a37ccba261d9026a90ae2640930d2666132))
- **globalUtils:** add lazy load factory ([625f99c](https://github.com/zcong1993/node-kit/commit/625f99c231dfc2efdcc23ca754fbadcffd053e48))
- redisLock del use lua keep it atomic ([e99679b](https://github.com/zcong1993/node-kit/commit/e99679b78da4c0a9b151e23393093d37a09f6def))
- **redisLock:** use lua script make redisLock compare and delete atomic ([38a889d](https://github.com/zcong1993/node-kit/commit/38a889d23ce5e895d2d5e8aade624e5d3a48dff1))
