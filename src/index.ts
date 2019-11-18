import visit from 'unist-util-visit'
import ALU from './alu'
import { IMarkdownASTNode, IPluginOptions, UnistNode } from './types'

interface IProps {
  markdownAST: IMarkdownASTNode
}

module.exports = async (
  { markdownAST }: IProps,
  pluginOptions: IPluginOptions
) => {
  const nodes: [IMarkdownASTNode, string][] = []

  visit(markdownAST as UnistNode, 'paragraph', (node: IMarkdownASTNode) => {
    const url = ALU.getAluURLFromMarkdownASTNode(node)
    if (url) {
      nodes.push([node, url])
    }
  })

  for (let i = 0; i < nodes.length; i++) {
    const [node, url] = nodes[i]
    try {
      const elm = await ALU.getAluElement(url, pluginOptions)
      node.type = 'html'
      node.value = elm
      node.children = null
    } catch (err) {
      console.error(err)
    }
  }

  return markdownAST
}
