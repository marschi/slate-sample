module.exports = {
     entry: [
       'babel-polyfill',
       './src/app.js'
     ],
     output: {
         path: __dirname + '/bin',
         filename: 'app.bundle.js',
         publicPath: "/bin/",
     },
     module: {
         loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader'
            },
            {
              test: /\.scss$/,
              use: [{
                loader: "style-loader" // creates style nodes from JS strings
              }, {
                loader: "css-loader" // translates CSS into CommonJS
              }, {
                loader: "sass-loader" // compiles Sass to CSS
              }]
            }
          ]
     },
     devServer: {
      proxy: {
        '/api/**': {
          changeOrigin: true,
          target: 'http://localhost:3000/',
          secure: false
        }
      }
    }
 }
