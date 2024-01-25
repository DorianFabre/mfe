import React, { lazy, Suspense } from 'react'; // lazy is a function, Suspense is a React component; used together for lazy loading
// Use BrowserRouter in the host (container) app only. This makes use of the BROWSER history object (the part of the URL after the domain)
// Remote (child) apps should use the MEMORY history object to prevent clashing/race conditions
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'; // used for customising CSS in React

import Header from './components/Header';
import Progress from './components/Progress';


// lazy load the remote (child) apps (ie only load them when required, not all at once)
const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));

// In production, generated CSS names are changed and shortened to save download time (jss1, jss2, jss3...)
// As a result, every app used in the microfrontend will have the same CSS identifiers applied to different elements, causing classname collisions
// To prevent this, use a production prefix
// NOTE: Different CSS-in-JS libraries may use different methods of dealing with this issue
const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

export default () => {
  return (
    <BrowserRouter>
      <StylesProvider generateClassName={generateClassName}>
        <div>

          {/* The Header component is always displayed */}
          <Header />

          {/* Display a loading message while the remote (child) apps are lazy loading */}
          <Suspense fallback={<Progress />}>

            {/* Choose which remote (child) app to display */}
            <Switch>
              {/* The route chosen is whichever path is the FIRST to match the URL: "/" should always be last as it picks up everything that has not been routed */}
              <Route path="/auth" component={AuthLazy} />
              <Route path="/" component={MarketingLazy} />
            </Switch>

          </Suspense>

        </div>
      </StylesProvider>
    </BrowserRouter>
  )
};