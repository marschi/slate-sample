import React from 'react'
import { Editor } from 'slate'
import { observer } from 'mobx-react';


@observer
export default class Main extends React.PureComponent {

  render() {
    const { store } = this.props;
    return (
      <Editor
        state={store.slateState}
        onChange={store.doUpdateSlateState}
      />
    );
  }

}
