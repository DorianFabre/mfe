import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Unlike the imported (remote) apps, no mount function is required to run this app in dev mode
// This is because this host (container) app will always need to inport the remotes
ReactDOM.render( // Takes 2 arguments...
  <App />, // ... the first is the element to render...
  document.querySelector('#root') // ... the second is where it should render
);