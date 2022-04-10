const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
    entry: [
      './public/index.js',
      './public/classes/Enemy.js',
      './public/classes/Explosion.js',
      './public/classes/Info.js',
      './public/classes/Player.js',
      './public/classes/Rocket.js',
    ],
    output: {
      path: __dirname,
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 
            {
                loader: "script-loader"
            }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              options: {
              }
            }
          ]
        }
      ]
    }
  };