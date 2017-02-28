var path = require('path');
var webpack = require('webpack');


var config = {
    entry: ['./src/js/jquery.getcontact.min.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'jquery.getcontact.js'
    },
    plugins: []
};


module.exports = config;