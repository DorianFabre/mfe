import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory, createBrowserHistory } from 'history';
import App from './App';

// Mount function to start up the app
const mount = (el, {  // this function's name could be anything; el is the HTML container element for the content...
  onNavigate, // ...onNavigate is a callback function passed in from the host (container) app which is called whenever a navigation event occurs in this remote (child) app...
  defaultHistory, // ...defaultHistory is used instead when this app is browsed in isolation...
  initialPath, // ... initialPath is the default path to be used when using MEMORY history...
  onSignIn // ...onSignIn is a callback function to let the host (container) app know that the user has signed in
}) => {
  const history = defaultHistory || createMemoryHistory({ // create a history object to pass to the App component, using BROWSER history if the app is used in isolation, and MEMORY history if not...
    initialEntries: [initialPath] // ... MEMORY history includes a default path (otherwise it defaults to "/")
  });
  
  // ...uses browser history if the app is used in isolation, and memory history if not
  if (onNavigate) { // if the onNavigate callback has been passed in (from the host (container) app only)...
    history.listen(onNavigate); // use history's built-in listener to call onNavigate whenever a navigation event occurs in this remote (child) app
  };

  ReactDOM.render( // Takes 2 arguments...
    <App  // ... the first is the element to render...
      history={history} // ... with the history object passed in as a prop...
      onSignIn={onSignIn} // ... and the onSignIn callback passed in as a prop...
    />,
    el // ... the second argument is where it should render
  );

  return {
    onParentNavigate({ pathname: nextPathname }) { // called whenever a navigation event happens in the host (container) app
      // The pathname is a property of the argument which is passed back when the callback is fired by using history.listen(onParentNavigate) in the host (container) app ...
      // ... and it is destructured and renamed to nextPathName as pathname is used again, below

        const { pathname } = history.location // get the current URL path (the part after the domain)

        // prevent infinite loops by comparing pathnames
        if (pathname !== nextPathname) { // if the current pathname is not the same as the nextPathname...
          history.push(nextPathname); // ...use the history object to navigate to the new path
        }
    }
  };
};

// If the app is running in development and in isolation, call mount immediately, otherwise ignore the following
if (process.env.NODE_ENV === 'development') {// if this is running in dev mode () - mode is set in webpack.config.js at module.exports.mode
  const devRoot = document.querySelector('#_auth-dev-root'); // the selector should be one that is unlikely to be used anywhere else, especially in the host (container) app
  if (devRoot) { // if the element exists...
    mount(devRoot, { defaultHistory: createBrowserHistory() }); // ... pass the element to the mount() function...
    // ...with a browser history object which is used when browsing in isolation (ie not in the host (container) app)
  }
}

// The mount function is exported so it can be used by the host (container) app whenever required
export { mount };