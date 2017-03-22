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
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     }
 }
