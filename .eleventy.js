const fs = require('fs')

const { DateTime } = require('luxon')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItToc = require('markdown-it-toc-done-right')
const uslug = require('uslug')

const input = 'src'
const output = 'dist'

function uslugify(s) {
  return uslug(s);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias('post', '_layouts/post')

  eleventyConfig.addPassthroughCopy({ [`${input}/_static`]: '.' })

  eleventyConfig.addFilter('readableDate', dateObj =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL dd, yyyy'))

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd'))

  eleventyConfig.addPairedShortcode('ifContentWithCode', function(innerTemplate, content) {
    return content.includes('</code>') ? innerTemplate : ''
  })

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
  eleventyConfig.addPlugin(syntaxHighlight)

  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkSymbol: '#',
    slugify: uslugify,
  }).use(markdownItToc, {
    slugify: uslugify,
    renderTocOpen: () => '<p><details><summary>Table of contents</summary><nav>',
    renderTocClose: () => '</nav></details></p>'
  })
  eleventyConfig.setLibrary('md', markdownLibrary)

  return {
    dir: {
      input,
      output
    }
  }
}
