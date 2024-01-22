// HtmlWebpackPlugin simplifies creation of HTML files to serve webpack bundles, especially where filenames are random and may change
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [ // used for loading items into the project
      {
        test: /\.m?js$/, // specifies that any file that ends in .js or .mjs will be processed by Babel...
        exclude: /node_modules/, // ... but ignore any in the node_modules folder
        use: { //the section below sets up Babel as required by this project (not much info in video!)
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // the file to serve on localhost:8080
    }),
  ]
}