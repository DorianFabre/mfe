import React, { useRef, useEffect } from 'react';
import { useHistory} from 'react-router-dom';

// ... webpack finds the 'marketing' item defined in webpack.config.js as a remote...
// ... and uses the 'MarketingApp' alias defined in the imported app's own webpack.config.js file...
// ... to import the 'mount' function which it exports, and renames it as 'productsMount'.
// NOTE: This is not imported as a React component as the host (container) must not assume a remote (child) app is using any particular framework
// This is in case either ever changes the framework it uses
// There should also be near-zero coupling between host and remote, and imports should be as generic as possible
import { mount } from 'marketing/MarketingApp';

// NOTE: using this approach makes it possible to use any framework in the imported remote (child) app, as long as it can be exported as an HTML element
export default () => {
  const ref = useRef(null);
  const history = useHistory(); // creates a BROWSER history object (not memory history as used in remote (child) apps)

  useEffect(() => { // runs when this component is first accessed
    const { onParentNavigate } = mount(ref.current, { // gets the onParentNavigate function which is returned from the Marketing app's bootstrap.js component
    // ... and creates an instance of the Marketing app using the mount() function...
      onNavigate: ({ pathname: nextPathname }) => { // the second argument is an object which includes the onNavigate callback function
      // The pathname is a property of the argument which is passed back when the callback is fired by using history.listen(onNavigate) in a remote (child) app ...
      // ... and it is destructured and renamed to nextPathName as pathname is used again, below

        const { pathname } = history.location // get the current URL path (the part after the domain)

        // prevent infinite loops by comparing pathnames
        if (pathname !== nextPathname) { // if the current pathname is not the same as the nextPathname...
          history.push(nextPathname); // ...use the history object to navigate to the new path
        }
      }
    }); // ...and renders it into the div below

    history.listen(onParentNavigate); // use history's built-in listener to call onParentNavigate whenever a navigation event occurs in this host (container) app...
    // ...onParentNavigate is a function that is passed in from the current remote (child) app and is used to update the navigation there
  }, []);

  return <div ref={ref} />; // provides a reference to the element that is to be displayed on-screen
};