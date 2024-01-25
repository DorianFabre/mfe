import React from 'react';
// Use BrowserRouter in the host (container) app only. This makes use of the BROWSER history object (the part of the URL after the domain)
// Remote (child) apps should use the MEMORY history object to prevent clashing/race conditions
import { BrowserRouter } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'; // used for customising CSS in React
import MarketingApp from './components/MarketingApp';
import Header from './components/Header';

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
          <Header />
          <MarketingApp />
        </div>
      </StylesProvider>
    </BrowserRouter>
  )
};