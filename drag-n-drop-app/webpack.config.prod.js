const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',                             // use optimizations
    entry: "./src/app.ts",
    output: {
        filename: 'app.js',                         // file HTML code uses
        path: path.resolve(__dirname, 'dist')       // direct path to main JS file

        /* NOT NEEDED FOR PROD: was required for webpack-dev-server
            for prod, we want to run webpack script and generate our output written to dist, and not served temporarily on locally running server
        publicPath: 'dist'                          // where output (app.js) is written to; where app.js is located
        */

    },
    devtool: 'none',                                // dont generate any src maps
    module: {                                       // applied per file
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
    },
    plugins: [                                      // applied to general workflow
        new CleanPlugin.CleanWebpackPlugin()        // automatically deletes everything in dist folder before new output is written there (always have latest code)
    ]
};