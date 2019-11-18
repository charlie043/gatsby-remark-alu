"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const AluURLRegexp = /https:\/\/alu\.jp\/series\/[^\/]*\/crop\/[A-Za-z0-9%]*/i;
const createUrl = (url) => {
    const [protocol, _url] = url.split('//');
    const [domain, series, seriesName, crop, identifier] = _url.split('/');
    const encodeSeriesName = encodeURIComponent(seriesName);
    const embedUrl = `${protocol}//${domain}/${series}/${encodeSeriesName}/${crop}/embed/${identifier}/0`;
    const captureUrl = `${protocol}//${domain}/${series}/${encodeSeriesName}/${crop}/${identifier}/0`;
    return { captureUrl, embedUrl };
};
exports.getAluURLFromMarkdownASTNode = (node) => {
    const childNode = node.children && node.children.length === 1 && node.children[0];
    return childNode &&
        childNode.type === 'link' &&
        !!childNode.url &&
        AluURLRegexp.test(childNode.url) &&
        childNode.children &&
        childNode.children.length >= 1
        ? childNode.url
        : null;
};
exports.getAluElement = (url, pluginOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { maxWidth } = pluginOptions;
    const { embedUrl, captureUrl } = createUrl(url);
    const response = yield node_fetch_1.default(embedUrl);
    const data = yield response.text();
    const $ = cheerio_1.default.load(data);
    const { firstimagewidth: width, firstimageheight: height, seriestitle: title } = $('figure.image').attr();
    const ratio = parseFloat(width) / parseFloat(height);
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
  `;
});
exports.default = {
    getAluURLFromMarkdownASTNode: exports.getAluURLFromMarkdownASTNode,
    getAluElement: exports.getAluElement
};
