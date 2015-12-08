import Handlebars = require('handlebars');
import File = require('vinyl');

import Configuration from './Configuration';
import SourceModel from './SourceModel';

import builtInHelpers from './builtInHelpers'


function ts2text(configuration: Configuration, tsInputFile: File) : File[] {
  var output : File[] = [];
  output.push(new File({
      path: configuration.outputPath,
  }))

  var helpers = builtInHelpers(output)  
  Object.keys(helpers)
    .forEach( helperName => Handlebars.registerHelper(helperName, helpers[helperName]) )

  
  var sourceModel = new SourceModel(tsInputFile)
  
  var compiled = Handlebars.compile(configuration.template);
  var producedContent = compiled({
      definitions: sourceModel.definitions
  });
  output[0].contents = new Buffer(producedContent)

  return output;
}
export = ts2text;