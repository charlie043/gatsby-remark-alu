const visit = require('unist-util-visit')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const AluRegexp = /https:\/\/alu\.jp\/series\/[^\/]*\/crop\/[A-Za-z0-9%]*/i

const isAluLink = node => {
  return (
    node.children.length === 1 &&
    node.children[0].type === 'link' &&
    AluRegexp.test(node.children[0].url) &&
    node.children[0].children.length >= 1
  )
}

const createUrl = url => {
  const [protocol, _url] = url.split('//')
  const [
    domain,
    series,
    seriesName,
    crop,
    identifier,
  ] = _url.split('/')
  const encodeSeriesName = encodeURIComponent(seriesName)
  const embedUrl = `${protocol}//${domain}/${series}/${encodeSeriesName}/${crop}/embed/${identifier}/0`
  const captureUrl = `${protocol}//${domain}/${series}/${encodeSeriesName}/${crop}/${identifier}/0`
  return { captureUrl, embedUrl }
}

const getAluElement = async (url, pluginOptions = {}) => {
  const { maxWidth } = pluginOptions
  const { embedUrl, captureUrl } = createUrl(url)
  const response = await fetch(embedUrl)
  const data = await response.text()
  const $ = cheerio.load(data)
  const {
    firstimagewidth: width,
    firstimageheight: height,
    seriestitle: title,
  } = $('figure.image').attr()
  const ratio = width / height

  return `
    <div class='gatsby-remark-alu' style='max-width:${maxWidth};margin:20px auto;'>

      <div class='gatsby-remark-alu_image' style="position:relative;margin:0 auto;width:${100}%;height:0;padding-top:${100 /
    ratio}%;">
        <iframe src="${embedUrl}" style="overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" scrolling="no" >${title} / alu.jp</iframe>
      </div>

      <div class="gatsby-remark-alu_capture" style="text-align: right;margin: 0 auto;">
        <a
          href="${captureUrl}"
          target="_blank"
          style="margin: 0 auto !important;display:inline-block;padding-top:10px;font-size:12px;color:#787c7b;text-decoration:none;text-align:right;">
          ${title} / alu.jp
        </a>
      </div>
    </div>
  `
}

module.exports = async ({ markdownAST }, pluginOptions) => {
  const nodes = []

  visit(markdownAST, 'paragraph', node => {
    if (isAluLink(node)) {
      const url = node.children[0].url
      nodes.push([node, url])
    }
  })

  for (let i = 0; i < nodes.length; i++) {
    const [node, url] = nodes[i]
    try {
      const elm = await getAluElement(url, pluginOptions)
      node.type = 'html'
      node.value = elm
      node.children = null
    } catch (err) {
      console.error(err)
    }
  }

  return markdownAST
}
