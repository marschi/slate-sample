import React from 'react';
import { Block, Data } from 'slate';
import { wrap, noop } from '../helpers';
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
  underlined: wrap('u')
};

const nodes = {
  // paragraph: ({ node, state, attributes }) => {
  //   const isFocused = state.selection.hasEdgeIn(node);
  //   return (
  //     <p className={isFocused ? 'is-focused' : ''} {...attributes}>{node.text}</p>
  //   )
  // },
  linkPreview: ({ node, state, attributes}) => {
    const isFocused = state.selection.hasEdgeIn(node);
    const link = node.data.get('link');
    const onClickClose = node.data.get('onClickClose') || noop;
    return (
      <LinkPreview onClickClose={() => onClickClose(node)} isFocused={isFocused} link={link} {...attributes} />
    )
  },
  link: ({ node, attributes, children }) => <a href={node.data.get('link')} {...attributes}>{children}</a>,
  blockquote: wrap('blockquote'),
  heading: wrap('h1'),
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
      transform.insertNodeByKey(doc.key, 0, block)
    }
  },
  // Rule to insert a paragraph below a void node
  // if that node is the last one in the document
  {
    match: (node) => node.kind == 'document',
    validate: (document) => {
      const lastNode = document.nodes.last()
      return lastNode && lastNode.isVoid ? true : null
    },
    normalize: (transform, document) => {
      const block = Block.create(defaultBlock);

      transform
        .insertNodeByKey(document.key, document.nodes.size, block)
    }
  },
  // Rule to insert a paragraph between two adjacent void nodes
  {
    match: (node) => node.kind == 'document',
    validate: (document) => {
      const invalidVoids = [];
      const nodes = document.nodes;
      for (let i = 0; i < nodes.size-1; i++) {
        if (nodes.get(i).isVoid && nodes.get(i+1).isVoid){
          invalidVoids.push(i);
        }
      }
      return invalidVoids.length ? invalidVoids : null;
    },
    normalize: (transform, document, invalidVoids) => {
      invalidVoids.forEach(i => {
          transform.insertNodeByKey(
            document.key,
            i+1,
            Block.create(defaultBlock)
          );
      });
    }
  }
]

const schema = { marks, nodes, rules }
export default schema;
