import { observable, action } from 'mobx';
import { Raw } from 'slate'

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
      }
    ]
  }, { terse: true });

  @action('Update the slate editors state')
  doUpdateSlateState = (state) => {
    this.slateState = state;
  }

}
