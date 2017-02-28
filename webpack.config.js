var path = require('path');
var webpack = require('webpack');


var config = {
    entry: ['./src/js/jquery.terminalSelect.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'jquery.terminalSelect.min.js'
    },
    plugins: []
};


module.exports = config;