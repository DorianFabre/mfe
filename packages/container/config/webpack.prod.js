// merge allows different config files to be used together (eg webpack.common.js & this file)
const { merge } = require('webpack-merge');
// ModuleFederationPlugin defines which files can be accessed by this host (container) app
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// import common config file to be merged with this one
const commonConfig = require('./webpack.common');
// import package.json in order to share common dependencies with remote (child) apps to prevent them from downloading multiple times
const packageJson = require('../package.json');

// set up an environment variable contain a string defining where the production app is hosted
// the variable will be defined in the CI/CD pipeline as a repository secret called PRODUCTION_DOMAIN
// the string will be used when webpack does a production build
const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: 'production', // causes files to be optimised/minified, amongst other things
  output: {
    filename: '[name].[contenthash].js', // used as a template for naming files when building files for production, primarily for caching
    publicPath: '/container/latest/', // prepends a path to the filenames that are generated so they can be found on the hosting service
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container', // just a description, not used for anything (the name is used when the app is a remote)
      remotes: { // lists apps that the container can search for additional code
        marketing: `marketing@${domain}/marketing/latest/remoteEntry.js`,
        // 'marketing:' - key used to link to imported items
        // 'marketing@...' - the name of the remote app, defined in it's own webpack.config.js file as 'name'
        // '...${domain}...' - environment variable set above
        // '.../marketing/latest...' - folder in domain containing the remote (child) app
        // '.../remoteEntry.js' - entry point for the remote app, defined in it's own webpack.config.js file as 'filename'
        auth: `auth@${domain}/auth/latest/remoteEntry.js`, // same rules as above
      },
      shared: packageJson.dependencies, // prevents libraries from downloading multiple times...
      // ... can be more specific by listing an array of items instead, eg: [react, react-dom, etc...]
    }),
  ]
};

// merge the common config file with the contents of this one
// any similar elements in the first item (commonConfig) will be overwritten by those in the second (prodConfig )
module.exports = merge(commonConfig, prodConfig)