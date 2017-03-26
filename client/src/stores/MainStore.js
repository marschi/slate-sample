import { observable, action } from 'mobx';
import { Raw } from 'slate';
import isUrl from 'is-url';

export default class MainStore {

  @observable slateState = Raw.deserialize({
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'A line of text in a paragraph.'
          }
        ]
      },
      {
        kind: 'block',
        type: 'linkPreview',
        data: { link: 'https://techcrunch.com/'},
        isVoid: true
      }
    ]
  }, { terse: true });

  @action('Update the slate editors state')
  doUpdateSlateState = (state) => {
    this.slateState = state;
  }

  @action('Add mark to currently selected text')
  doToggleMark = (type) => {
    this.slateState = this.slateState.transform().toggleMark(type).apply();
  }

  @action('Insert link node if last typed word is link')
  doMaybeInsertLink = (text) => {
    if (!text) return;
    let transform = this.slateState.transform();
    if (isUrl(text)){
      transform.insertBlock({
        type: 'linkPreview',
        isVoid: true,
        data: { link: text }
      }).collapseToEnd();
    } else {
      transform = transform.insertText(text);
    }
    this.slateState = transform.apply();
  }

}
