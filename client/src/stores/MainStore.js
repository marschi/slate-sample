import { observable, action } from 'mobx';
import { Raw, Data } from 'slate';
import isUrl from 'is-url';
import invariant from 'invariant';

const getSelectionPosition = () => {
  try {
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    return {
      left: rect.left + rect.width/2,
      top: rect.top
    }
  } catch (e) {
    return;
  }
}

export default class MainStore {

  @observable slateState = Raw.deserialize({
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: `Ancient alien vortex clearly choral castle, Sumerian texts Mahabharata ancient religions Sumerian texts, extraterrestrial origin ancient civilization. Burmuta triangle sky people space time inter-dimensional star gates electromagnetic, otherworldly visitors alien extraterrestrial origin, the answer is a resounding YES... Stonehenge otherworldly visitors sanskrit. Mainstream archaelogy star people, extraterrestrial origin Mayan.`
          }
        ]
      }
    ]
  }, { terse: true });

  @observable selectionPosition;

  @action('Update the slate editors state')
  doUpdateSlateState = (state) => {
    this.slateState = state;
    this.selectionPosition = getSelectionPosition();
  }

  @action('Add a new line paragrah')
  doInsertNextLine = () => {
    // this.slateState = this.slateState.transform().splitInline().apply();
  }

  @action('Add mark to currently selected text')
  doToggleMark = (type) => {
    this.slateState = this.slateState.transform().toggleMark(type).apply();
  }

  @action('Set block type of currently selected block')
  doSetBlockType = (blockType) => {
    if (!this.slateState.blocks.size) return;
    let transform = this.slateState.transform();
    const { blocks } = this.slateState;
    let blockTypes = Object.keys(blocks.groupBy(({ type }) => type).toJS());
    if (blockTypes.find(type => type === blockType)){
      transform.setBlock('paragraph');
    } else {
      transform.setBlock(blockType);
    }
    this.slateState = transform.apply();
  }

  @action('Insert link node if last typed word is link')
  doMaybeInsertLink = (text) => {
    if (!text) return;
    let transform = this.slateState.transform();
    if (isUrl(text)){
      transform.insertBlock({
        type: 'linkPreview',
        isVoid: true,
        data: { link: text, onClickClose: this.doRemoveLinkPreview }
      }).collapseToEnd();
    } else {
      transform = transform.insertText(text);
    }
    this.slateState = transform.apply();
  }

  @action('Remove link preview')
  doRemoveLinkPreview = (node) => {
    const link = node.data.get('link');
    this.slateState = this.slateState
      .transform()
      .collapseToStartOf(node)
      .collapseToEndOfPreviousBlock()
      .removeNodeByKey(node.key)
      .insertText(' '+link)
      .extend(-link.length)
      .wrapInline({ type: 'link', data: { link } })
      .apply();
  }

  @action('Toggle the media icons')
  doToggleMediaIcons = () => {
    this.isMediaIconsExpanded = !this.isMediaIconsExpanded;
  }

}
