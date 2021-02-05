const path = require('path');

module.exports = {
    mode: 'development',                            // do fewer optimizations; building for dev; better error msg, easier debugging, etc...
    entry: "./src/app.ts",
    output: {
        filename: 'app.js',                         // file HTML code uses
        path: path.resolve(__dirname, 'dist'),      // direct path to main JS file
        publicPath: 'dist'                          // where output (app.js) is written to; where app.js is located
    },
    devtool: 'inline-source-map',                   // improve dev; better error msgs
    module: {
        rules: [
            {
                test: /\.ts$/,                      // find these files
                use: 'ts-loader',                   // what to do with them
                exclude: /node_modules/             // exclude
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']                  // resolves for these files
    }
};