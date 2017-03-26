import React from 'react'
import { Editor } from 'slate'
import { observer } from 'mobx-react';
import Popover from 'react-popover';
import classnames from 'classnames'
import { Icon, noop } from '../helpers';
import { } from './styles.scss';
import schema from './schema'


const markIcons = [
  ['bold', 'bold'],
  ['code', 'code'],
  ['italic', 'italic'],
  ['underlined', 'underline'],
];

const blockIcons = [
  ['blockquote', 'quote-left'],
  ['heading', 'header']
];

const generateButtons = (onClick = noop, isActive = noop) => ([type, icon], i) => (
  <MarkButton
    key={i}
    icon={icon}
    isActive={isActive(type)}
    onClick={() => onClick(type)}
  />
);

const hasType = set => type => set.some(set => set.type === type);

const MarkBar = ({
  isOpen,
  position,
  selectionMarks,
  selectionBlocks,
  onClickMark = noop,
  onClickBlock = noop,
}) => {
  const popoverBody = (
    <div className="popover-content">
      <div className="icon-group mark-icons">
        {markIcons.map(generateButtons(onClickMark), hasType(selectionMarks))}
      </div>
      { true &&
        <div className="icon-group block-icons">
          {blockIcons.map(generateButtons(onClickBlock, hasType(selectionBlocks)))}
        </div>
      }
    </div>
  );
  return (
    <Popover isOpen={isOpen} body={popoverBody}>
      <span className="popover-dummy" style={position} />
    </Popover>
  );
};

const MarkButton = ({ icon, onClick = noop, isActive }) => (
  <span onMouseDown={e => e.preventDefault() || onClick() }>
    <Icon
      className={classnames('mark-icon', { 'active': isActive })}
      type={icon}
    />
  </span>
);

const MediaIcons = ({
  selectionPosition = { top: -100 },
  isExpanded,
  onClickExpand = noop,
  onClickMediaIcon = noop,
  icons
}) => (
  <div className={classnames('media-icons', { 'is-expanded': isExpanded })} style={{top: selectionPosition.top }}>
    <span onClick={e => e.preventDefault() || onClickExpand()}>
      <Icon className="expand-button" type="plus-circle" />
    </span>
  </div>
);


@observer
export default class Main extends React.PureComponent {

  onPaste = (e, { text }) => {
    store.doMaybeInsertLink(text);
  }

  getOverlay = () => {
    const { store } = this.props;
    const { isBlurred, isCollapsed, startBlock, endBlock } = store.slateState;
    const { selectionPosition } = store;
    return (
      <div className="overlay">
        <MarkBar
          isOpen={!isBlurred && !isCollapsed}
          position={selectionPosition}
          selectionMarks={store.slateState.marks}
          selectionBlocks={store.slateState.blocks}
          onClickMark={store.doToggleMark}
          onClickBlock={store.doSetBlockType}
        />
      </div>
    )

  }

  render() {
    const { store } = this.props;
    return (
      <div className="container">
        { this.getOverlay() }
        <div className="row instructions">
          <h1 className="col-sm-12">How to</h1>
          <p className="col-sm-12">Mark text to show the hovering menu. Paste a link to create a preview.</p>
        </div>
        <div className="row">
          <div
            className="editor-container"
            >
            <Editor
              schema={schema}
              state={store.slateState}
              onChange={store.doUpdateSlateState}
              onPaste={this.onPaste}
              onKeyDown={this.onKeyDown}
            />
          </div>
        </div>
      </div>
    );
  }

}
