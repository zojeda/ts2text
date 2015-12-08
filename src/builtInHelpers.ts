import File = require('vinyl');
import path = require('path');
var CircularJSON = require('circular-json');

import {objectExpression} from './utils';

export interface HelperMap{
	 [s: string]: Function; 
};
 
 

export default function builtInHelpers(outputFiles: File[]): HelperMap {

  var helpers: HelperMap = {
    "if": function(conditional, options) {
      if(objectExpression(conditional, this)) {
        return options.fn(this);
      }
    },
    
    "eval": function(expr) {
      return objectExpression(expr, this)
    },
    "nodetext": function() {
      return this.getText();
    },
    
    "remove": function(text, toRemove) {
      return text.replace(toRemove, '')
    },
    "json": function(element) {
      return CircularJSON.stringify(element || this, null, 2);
    },
    'block-params': function() {
      var args = [],
          options = arguments[arguments.length - 1];
      for (var i = 0; i < arguments.length - 1; i++) {
        args.push(arguments[i]);
      }
    
      return options.fn(this, {data: options.data, blockParams: args});
    },    
    'outputFile' : function(options) {
      var content = options.fn(this);
      var base = options.hash.base || './'
      var file = new File({
          path: options.hash.path || path.join(base, options.hash.stem +'.'+ options.hash.extname),
          contents: new Buffer(content)
        });
      outputFiles.push(file)
      return null;
    }
  };
  return helpers;
};

  
  
  
	


