import { IMarkdownASTNode, IPluginOptions } from './types/index'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

const AluURLRegexp = /https:\/\/alu\.jp\/series\/[^\/]*\/crop\/[A-Za-z0-9%]*/i

const createUrl = (url: string): { captureUrl: string; embedUrl: string } => {
  const [protocol, _url] = url.split('//')
  const [domain, series, seriesName, crop, identifier] = _url.split('/')
  const encodeSeriesName = encodeURIComponent(seriesName)
  const embedUrl = `${protocol}//${domain}/${series}/${encodeSeriesName}/${crop}/embed/${identifier}/0`
  const captureUrl = `${protocol}//${domain}/${series}/${encodeSeriesName}/${crop}/${identifier}/0`
  return { captureUrl, embedUrl }
}

export const getAluURLFromMarkdownASTNode = (
  node: IMarkdownASTNode
): string | null => {
  const childNode =
    node.children && node.children.length === 1 && node.children[0]
  return childNode &&
    childNode.type === 'link' &&
    !!childNode.url &&
    AluURLRegexp.test(childNode.url) &&
    childNode.children &&
    childNode.children.length >= 1
    ? childNode.url
    : null
}

export const getAluElement = async (
  url: string,
  pluginOptions: IPluginOptions
) => {
  const { maxWidth } = pluginOptions
  const { embedUrl, captureUrl } = createUrl(url)
  const response = await fetch(embedUrl)
  const data = await response.text()
  const $ = cheerio.load(data)
  const {
    firstimagewidth: width,
    firstimageheight: height,
    seriestitle: title
  } = $('figure.image').attr()
  const ratio = parseFloat(width) / parseFloat(height)

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

export default {
  getAluURLFromMarkdownASTNode,
  getAluElement
}
