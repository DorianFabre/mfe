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
  }
}