import React, { lazy, Suspense, useState, useEffect } from 'react'; // lazy is a function, Suspense is a React component; used together for lazy loading

// NOTE: if the history object does not have to be manipulated, use BrowserRouter IN THE HOST (CONTAINER) APP ONLY.
// This makes use of the BROWSER history object (the part of the URL after the domain)
// Remote (child) apps should use the MEMORY history object to prevent clashing/race conditions
// If history manipulation is required (as here), use Router
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import { createBrowserHistory } from 'history';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'; // used for customising CSS in React

import Header from './components/Header';
import Progress from './components/Progress';


// lazy load the remote (child) apps (ie only load them when required, not all at once)
const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

// In production, generated CSS names are changed and shortened to save download time (jss1, jss2, jss3...)
// As a result, every app used in the microfrontend will have the same CSS identifiers applied to different elements, causing classname collisions
// To prevent this, use a production prefix
// NOTE: Different CSS-in-JS libraries may use different methods of dealing with this issue
const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const history = createBrowserHistory(); // create a history object

export default () => {
  // state object to hold the signedIn value
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) { // if the user has just signed in...
      history.push('/dashboard'); // ...redirect to the dsahboard
    }
  }, [isSignedIn]); // run this function whenever the state of isSignedIn changes

  return (

    // Pass the history object to the Router
    <Router history={history}>
      
      {/* Apply any required styles from material-ui */}
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
              {/* AuthLazy is passed in as a React component as it needs to include the onSignIn function as a prop */}
              <Route path="/auth">
                <AuthLazy onSignIn={() => setIsSignedIn(true)} />
              </Route>

              {/* DashboardLazy is passed in as a React component as it needs to route back to the home page if the user is not signed in */}
              <Route path="/dashboard">
                {!isSignedIn && <Redirect to="/" />}
                <DashboardLazy />
              </Route>

              {/* MarketingLazy has no requirement to redirect or pass any props so it is specified as the Route's component property */}
              <Route path="/" component={MarketingLazy} />

            </Switch>

          </Suspense>

        </div>
      </StylesProvider>
    </Router>
  )
};