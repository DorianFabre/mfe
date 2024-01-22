// merge allows different config files to be used together (eg webpack.common.js & this file)
const { merge } = require('webpack-merge');
// HtmlWebpackPlugin simplifies creation of HTML files to serve webpack bundles, especially where filenames are random and may change
const HtmlWebpackPlugin = require('html-webpack-plugin');
// ModuleFederationPlugin defines which files can be accessed by this host (container) app
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// import common config file to be merged with this one
const commonConfig = require('./webpack.common');
// import package.json in order to share common dependencies with remote (child) apps to prevent them from downloading multiple times
const packageJson = require('../package.json');

const devConfig = {
  mode: 'development',
  devServer: {
    port: 8080, // this app is served on localhost:8080 as a standalone item
    historyApiFallback: {
      index: 'index.html',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container', // just a description, not used for anything (the name is used when the app is a remote)
      remotes: { // lists apps that the container can search for additional code
        marketing: 'marketing@http://localhost:8081/remoteEntry.js',
        // 'marketing:' - key used to link to imported items. Must be exactly the same spelling
        // 'marketing@...' - the name of the remote app, defined in it's own webpack.config.js file as 'name'
        // '...@http://localhost:8081/...' - URL for the remote app's entry file, defined in it's own webpack.config.js file as the devServer port
        // '.../remoteEntry.js' - entry point for the remote app, defined in it's own webpack.config.js file as 'filename'
      },
      shared: packageJson.dependencies, // prevents libraries from downloading multiple times...
      // ... can be more specific by listing an array of items instead, eg: [react, react-dom, etc...]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html', // the file to serve on localhost:8080
    }),
  ],
};

// merge the common config file with the contents of this one
// any similar elements in the first item (commonConfig) will be overwritten by those in the second (devConfig )
module.exports = merge(commonConfig, devConfig) 