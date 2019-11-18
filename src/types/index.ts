import { Node } from 'unist'

export type UnistNode = Node

export interface IPluginOptions {
  maxWidth?: string
}

export interface IMarkdownASTNode extends Node {
  type: string
  children: Array<IMarkdownASTNode> | null
  url?: string
}
