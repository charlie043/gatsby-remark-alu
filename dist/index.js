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
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const alu_1 = __importDefault(require("./alu"));
module.exports = ({ markdownAST }, pluginOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const nodes = [];
    unist_util_visit_1.default(markdownAST, 'paragraph', (node) => {
        const url = alu_1.default.getAluURLFromMarkdownASTNode(node);
        if (url) {
            nodes.push([node, url]);
        }
    });
    for (let i = 0; i < nodes.length; i++) {
        const [node, url] = nodes[i];
        try {
            const elm = yield alu_1.default.getAluElement(url, pluginOptions);
            node.type = 'html';
            node.value = elm;
            node.children = null;
        }
        catch (err) {
            console.error(err);
        }
    }
    return markdownAST;
});
