import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'; // used for customising CSS in React

import Landing from './components/Landing';
import Pricing from './components/Pricing';

// In production, generated CSS names are changed and shortened to save download time (jss1, jss2, jss3...)
// As a result, every app used in the microfrontend will have the same CSS identifiers applied to different elements
// To prevent this, use a production prefix:
const generateClassName = createGenerateClassName({
  productionPrefix: 'ma',
});

export default () => {
  return <div>
    <StylesProvider generateClassName={generateClassName}>
      <BrowserRouter>
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
      </BrowserRouter>
    </StylesProvider>
  </div>
}