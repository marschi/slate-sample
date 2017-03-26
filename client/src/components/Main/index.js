import React from 'react'
import { Editor } from 'slate'
import { observer } from 'mobx-react';
import Popover from 'react-popover';
import classnames from 'classnames'
import { Icon } from '../helpers';
import { } from './styles.scss';
import schema from './schema'

const marks = [
  ['bold', 'bold'],
  ['code', 'code'],
  ['italic', 'italic'],
  ['underlined', 'underline'],
  ['heading', 'header']
];

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

@observer
export default class Main extends React.PureComponent {

  onPaste = (e, { text }) => {
    store.doMaybeInsertLink(text);
  }

  onKeyDown = (e, { key }) => {

  }

  render() {
    const { store } = this.props;
    const { isBlurred, isCollapsed } = store.slateState;
    return (
      <div className="container">
        <div className="row vertical-spacer" />
        <div className="row">
          <MarkBar
            isOpen={!isBlurred && !isCollapsed}
            position={getSelectionPosition()}
            marks={marks}
            selectionMarks={store.slateState.marks}
            onClickMark={store.doToggleMark}
          />
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

const hasMark = (marks, type) => marks.some(mark => mark.type == type);

const MarkBar = ({ isOpen, position, marks, selectionMarks, onClickMark, children }) => {
  const popoverBody = (
    <div className="popover-content">
      {marks.map(([type, icon], i) => (
        <MarkButton isActive={hasMark(selectionMarks, type)} key={i} icon={icon} onClick={() => onClickMark(type)} />
      ))}
    </div>
  );
  return (
    <Popover isOpen={isOpen} body={popoverBody}>
      <span className="popover-dummy" style={position} />
    </Popover>
  );
}



const MarkButton = ({ icon, onClick, isActive }) => (
  <span onMouseDown={e => e.preventDefault() || onClick() }>
    <Icon
      className={classnames('mark-icon', { 'active': isActive })}
      type={icon}
    />
  </span>
);
