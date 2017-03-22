import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import MainStore from './stores/MainStore';

const rootNode = document.getElementById('root');

const store = window.store = new MainStore();

ReactDOM.render(
  <Main store={store} />,
  rootNode
);
