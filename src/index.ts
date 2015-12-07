import File = require('vinyl');
var through = require('through2');    

var ts2text = require('./ts2text');


interface Configuration {
  template: string,
  outputPath: string
}

module.exports = function(configuration: Configuration) {
  
  var transform = function(file, encoding, callback) {
    function withTemplate() {
      return ts2text(configuration.template, file);
    }
    var producedContent = withTemplate();
    var output = new File({
      path: configuration.outputPath,
      contents: new Buffer(producedContent)
    });
    this.push(output);
    callback();
  }; 

  return through.obj(transform);
};

