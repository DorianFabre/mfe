import React, { useRef, useEffect } from 'react';

// ... webpack finds the 'dashboard' item defined in webpack.config.js as a remote...
// ... and uses the 'DashboardApp' alias defined in the imported app's own webpack.config.js file...
// ... to import the 'mount' function which it exports, and renames it as 'dashboardMount'.
// NOTE: This is not imported as a React component as the host (container) must not assume a remote (child) app is using any particular framework
// This is in case either ever changes the framework it uses
// There should also be near-zero coupling between host and remote, and imports should be as generic as possible
import { mount } from 'dashboard/DashboardApp';

// NOTE: using this approach makes it possible to use any framework in the imported remote (child) app, as long as it can be exported as an HTML element
export default () => { 
  const ref = useRef(null);

  useEffect(() => { // runs when this component is first accessed
    mount(ref.current, { // creates an instance of the Dashboard app using the mount() function and renders it into the div at the bottom of this page
    })
  }, []);

  return <div ref={ref} />; // provides a reference to the element that is to be displayed on-screen
};