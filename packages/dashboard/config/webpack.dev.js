// merge allows different config files to be used together (eg webpack.common.js & this file)
const { merge } = require('webpack-merge');
// HtmlWebpackPlugin simplifies creation of HTML files to serve webpack bundles, especially where filenames are random and may change
const HtmlWebpackPlugin = require('html-webpack-plugin');
// ModuleFederationPlugin defines which files can be accessed by the host (container)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// import common config file to be merged with this one
const commonConfig = require('./webpack.common');
// import package.json in order to share common dependencies with other apps to prevent them from downloading multiple times
const packageJson = require('../package.json');

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:8083/'  // prepends to the filenames that are generated so they can be found on the hosting service - must be identical to the port listed below
  },
  devServer: {
    port: 8083, // this app is served on localhost:8083 as a standalone item
    historyApiFallback: {
      index: '/index.html',
    },
    headers: {
      'Access-Control_Allow_Origin': '*' // set CORS to accept content from other origins, used for the fonts in this app
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard', // name is used in host's (container) own webpack.config.js file when importing remote apps... 
      // ... used in the beginning of the URL for the app (ie 'dashboard@http...')
      filename: 'remoteEntry.js', // contains a list of available files & directions on how to load them..
      // ... used in the host's (container) own webpack.config.js file when importing remote apps as the end of the URL (ie '...localhost:8083/remoteEntry.js')
      exposes: {  // creates a version of the file that can be loaded into a browser.
        './DashboardApp': './src/bootstrap', // creates an alias for the file that can be called in the host (container) app
      },
      shared: packageJson.dependencies, // prevents libraries from downloading multiple times...
      // ... can be more specific by listing an array of items instead, eg: [react, react-dom, etc...]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html', // the file to serve on localhost:8083
    }),
  ],
};

// merge the common config file with the contents of this one
// any similar elements in the first item (commonConfig) will be overwritten by those in the second (devConfig )
module.exports = merge(commonConfig, devConfig) 