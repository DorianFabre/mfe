import React, { lazy, Suspense, useState } from 'react'; // lazy is a function, Suspense is a React component; used together for lazy loading
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
  // state object to hold the signedIn value
  const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <BrowserRouter>
      <StylesProvider generateClassName={generateClassName}>
        <div>

          {/* The Header component is always displayed so does not fall within the Suspense/Switch section below */}
          {/* isSignedIn is passed to the Header to control which text it displays, which Route to take, and whether the signOut function will run */}
          {/* onSignOut is triggered by a button in the Header */}
          <Header isSignedIn={isSignedIn} onSignOut={() => setIsSignedIn(false)} />

          {/* Display a loading message while the remote (child) apps are lazy loading */}
          <Suspense fallback={<Progress />}>

            {/* Choose which remote (child) app to display */}
            <Switch>
              {/* The route chosen is whichever has the path that FIRST matches the URL => "/" should always be last as it picks up everything that has not been routed */}
              <Route path="/auth">
                {/* AuthLazy is passed in as a React component as it needs to include the onSignIn function as a prop */}
                <AuthLazy onSignIn={() => setIsSignedIn(true)} />
              </Route>
              {/* MarketingLazy has no requirement to pass any props so it is included as the Route's component property */}
              <Route path="/" component={MarketingLazy} />
            </Switch>

          </Suspense>

        </div>
      </StylesProvider>
    </BrowserRouter>
  )
};