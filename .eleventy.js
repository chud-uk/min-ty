const fs = require('fs')

const { DateTime } = require('luxon')
const pluginRss = require('@11ty/eleventy-plugin-rss')

const input = 'src'
const output = 'dist'

module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias('post', '_layouts/post')

  eleventyConfig.addPassthroughCopy({ [`${input}/_static`]: '.' })

  eleventyConfig.addFilter('readableDate', dateObj =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL dd, yyyy'))

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd'))

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(_err, browserSync) {
        const content_404 = fs.readFileSync(`${output}/404.html`)
        browserSync.addMiddleware('*', (_req, res) => {
          res.write(content_404)
          res.end()
        })
      },
    },
    ui: false,
    ghostMode: false
  })

  eleventyConfig.addPlugin(pluginRss)

  return {
    dir: {
      input,
      output
    }
  }
}
