import { createApp} from 'vue';
import Dashboard from './components/Dashboard.vue';

// Mount function to start up the app
const mount = (el) => { // this function's name could be anything; el is the HTML container element for the content
  const app = createApp(Dashboard);
  app.mount(el); // app.mount() is unrelated to the outer mount = (el) function, it shows the Vue component within the DOM 
};

// If the app is running in development and in isolation, call mount immediately, otherwise ignore the following
if (process.env.NODE_ENV === 'development') {// if this is running in dev mode () - mode is set in webpack.config.js at module.exports.mode
  const devRoot = document.querySelector('#_dashboard-dev-root'); // the selector should be one that is unlikely to be used anywhere else, especially in the host (container) app
  if (devRoot) { // if the element exists...
    mount(devRoot); // ... pass the element to the mount() function
  }
}

// The mount function is exported so it can be used by the host (container) app whenever required
export { mount };