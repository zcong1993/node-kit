const getNextVersion =
  process.env.FORCE_NEXT_VERSION && process.env.FORCE_NEXT_VERSION !== '*'
    ? () => {
        const nextVersion = process.env.FORCE_NEXT_VERSION
        console.log(`shipjs use force next version: ${nextVersion}`)
        return nextVersion
      }
    : undefined

module.exports = {
  getNextVersion,
}
