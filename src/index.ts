import File = require('vinyl');
var through = require('through2');    

import ts2text = require('./ts2text');

import Configuration from './Configuration'

exports = function(configuration: Configuration) {
  
  var transform = function(file, encoding, callback) {
    var producedContent = ts2text(configuration, file);
    
    producedContent.forEach(file => this.push(file))
    callback();
  }; 

  return through.obj(transform);
};

