import React from 'react';

// Remote (child) apps should use the MEMORY history object by importing Router
// Use BrowserRouter in the host (container) app only. This makes use of the BROWSER history object (the part of the URL after the domain)
// This is to prevent clashing/race conditions 
import { Switch, Route, Router } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'; // used for customising CSS in React

import Landing from './components/Landing';
import Pricing from './components/Pricing';

// In production, generated CSS names are changed and shortened to save download time (jss1, jss2, jss3...)
// As a result, every app used in the microfrontend will have the same CSS identifiers applied to different elements, causing classname collisions
// To prevent this, use a production prefix
// NOTE: Different CSS-in-JS libraries may use different methods of dealing with this issue
const generateClassName = createGenerateClassName({
  productionPrefix: 'ma',
});

export default ({ history }) => { // passing in the history prop from bootstrap.js
  return <div>
    <StylesProvider generateClassName={generateClassName}>
      {/* Pass the history object to Router */}
      <Router history={history}> 
        <Switch>
          <Route
            exact
            path="/pricing"
            component={Pricing}
          />
          <Route
            path="/"
            component={Landing}
          />
        </Switch>
      </Router>
    </StylesProvider>
  </div>
}