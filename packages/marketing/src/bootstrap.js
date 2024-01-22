import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Mount function to start up the app
const mount = (el) => {  // this function's name could be anything; el is the container for the content
  ReactDOM.render( // Takes 2 arguments...
    <App />, // ... the first is the element to render...
    el // ... the second is where it should render
  ); 
};

// If the app is running in development and in isolation, call mount immediately, otherwise ignore the following
if (process.env.NODE_ENV === 'development') {// if this is running in dev mode () - mode is set in webpack.config.js at module.exports.mode
  const devRoot = document.querySelector('#_marketing-dev-root'); // the selector should be one that is unlikely to be used anywhere else, especially in the host (container) app
  if (devRoot) { // if the element exists...
    mount(devRoot); // ... pass the element to the mount() function 
  }
}

// The mount function is exported so it can be used by the host (container) app whenever required
export { mount };