module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 1,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'unsized-images': 'warn',
      },
    },
  },
}
