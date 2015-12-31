import File = require('vinyl');
import path = require('path');
import * as ts from 'typescript';
var CircularJSON = require('circular-json');

import SourceModel from './SourceModel';
import {objectExpression} from './utils';

export interface HelperMap{
	 [s: string]: Function; 
};
 
 

export default function builtInHelpers(outputFiles: File[], sourceModel: SourceModel): HelperMap {

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
      var args = [];
      var options = arguments[arguments.length - 1];
      for (var i = 0; i < arguments.length - 1; i++) {
        args.push(arguments[i]);
      }
    
      return options.fn(this, {data: options.data, blockParams: args});
    },
    'firstUppercase' : function(text: string) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    'firstLowercase' : function(text: string) {
      return text.charAt(0).toLowerCase() + text.slice(1);
    }, 
    //FIXME : quick and dirty
    'qualifiedName' : function(definition: ts.DefinitionInfo ){
      var definitionNames: string[] = [definition.name]; 
      function getParent(def: ts.DefinitionInfo) : ts.DefinitionInfo {
        var parentsFound = sourceModel.definitions.filter(def2 => def2.name===def.containerName);
        return parentsFound ? parentsFound[0] : undefined;
      }
      var currentParent = getParent(definition);
      while(currentParent) {
        definitionNames.push(currentParent.name);
        currentParent = getParent(currentParent);
      }
      var result = definitionNames.reverse().join('.');
      return result;
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
