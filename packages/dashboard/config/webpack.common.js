// This file differs from the same one in the other apps as it allows the import of a Vue component

const { VueLoaderPlugin } = require('vue-loader');

module.exports = {

  // allow the app to import Vue files...
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js' // used as a template for naming files, primarily to prevent caching
  },
  resolve: {
    extensions: ['.js', '.vue'] // Vue has it's own extensions
  },

  module: {
    rules: [ // used for loading items into the project
      {
        test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)$/i, // allow different image and font types to be processed by Babel...
        use: [
          { loader: 'file-loader' } // ...and load them with file-loader
        ]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader' // use vue-loader to load .vue files
      },
      {
        test: /\.scss|\.css$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader', 'sass-loader'] // use these loaders to load .scss and .css files
      },
      {
        test: /\.m?js$/, // specifies that any file that ends in .js or .mjs will be processed by Babel...
        exclude: /node_modules/, // ... but ignore any in the node_modules folder
        use: { //the section below sets up Babel as required by this project (not much info in video!)
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  plugins: [new VueLoaderPlugin()], // no info in the course as to what this actually does but I assume it facilitates loading Vue components
};