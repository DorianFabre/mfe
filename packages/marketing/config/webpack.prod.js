// merge allows different config files to be used together (eg webpack.common.js & this file)
const { merge } = require('webpack-merge');
// ModuleFederationPlugin defines which files can be accessed by this host (container) app
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// import common config file to be merged with this one
const commonConfig = require('./webpack.common');
// import package.json in order to share common dependencies with remote (child) apps to prevent them from downloading multiple times
const packageJson = require('../package.json');

const prodConfig = {
  mode: 'production', // causes files to be optimised/minified, amongst other things
  output: {
    filename: '[name].[contenthash].js', // used as a template for naming files when building files for production, primarily for caching
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'marketing', // name is used in host's (container) own webpack.config.js file when importing remote apps... 
      // ... used in the beginning of the URL for the app (ie 'products@http...')
      filename: 'remoteEntry.js', // contains a list of available files & directions on how to load them..
      // ... used in the host's (container) own webpack.config.js file when importing remote apps as the end of the URL (ie '...localhost:8081/remoteEntry.js')
      exposes: {  // creates a version of the file that can be loaded into a browser.
        './MarketingApp': './src/bootstrap', // creates an alias for the file that can be called in the host (container) app
      },
      shared: packageJson.dependencies, // prevents libraries from downloading multiple times...
      // ... can be more specific by listing an array of items instead, eg: [react, react-dom, etc...]
    }),
  ],
};

// merge the common config file with the contents of this one
// any similar elements in the first item (commonConfig) will be overwritten by those in the second (prodConfig )
module.exports = merge(commonConfig, prodConfig) 