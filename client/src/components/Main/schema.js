import React from 'react';
import { Block } from 'slate';
import { wrap } from '../helpers';
import LinkPreview from '../LinkPreview';

const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {}
}

const marks = {
  bold: wrap('strong'),
  code: wrap('code'),
  italic: wrap('em'),
  underlined: wrap('u'),
  heading: wrap('h1')
};

const nodes = {
  linkPreview: ({ node, state, attributes}) => {
    const isFocused = state.selection.hasEdgeIn(node);
    const link = node.data.get('link');
    return (
      <LinkPreview isFocused={isFocused} link={link} {...attributes} />
    )
  }
}

const rules = [
  // Rule to insert a paragraph block if the document is empty
  {
    match: (node) => {
      return node.kind == 'document'
    },
    validate: (doc) => {
      return doc.nodes.size ? null : true
    },
    normalize: (transform, doc) => {
      const block = Block.create(defaultBlock)
      transform
        .insertNodeByKey(doc.key, 0, block)
    }
  },
  // Rule to insert a paragraph below a void node (the image)
  // if that node is the last one in the document
  {
    match: (node) => {
      return node.kind == 'document'
    },
    validate: (document) => {
      const lastNode = document.nodes.last()
      return lastNode && lastNode.isVoid ? true : null
    },
    normalize: (transform, document) => {
      const block = Block.create(defaultBlock)
      transform
        .insertNodeByKey(document.key, document.nodes.size, block)
    }
  }
]

const schema = { marks, nodes, rules }
export default schema;
