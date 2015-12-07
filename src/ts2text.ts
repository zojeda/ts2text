import Handlebars = require('handlebars');
import CircularJSON = require('circular-json');
import File = require('vinyl');


import SourceModel from './SourceModel';

Handlebars.registerHelper('if', function(conditional, options) {
  if(objectExpression(conditional, this)) {
    return options.fn(this);
  }
});

Handlebars.registerHelper('eval', function(expr) {
  return objectExpression(expr, this)
});
Handlebars.registerHelper('nodetext', function() {
  return this.getText();
});

Handlebars.registerHelper('remove', function(text, toRemove) {
  return text.replace(toRemove, '')
});
Handlebars.registerHelper('json', function(element) {
  return CircularJSON.stringify(element, null, 2);
});


function objectExpression(expression, obj) {
  var result = `return ${expression} ;`;
  var args : string[] = Object.keys(obj);
  var conditionExpr = new Function(args.join(','), result);
  var argsValues = args.map(arg => obj[arg]);
  return conditionExpr.apply(obj, argsValues);
}

function ts2text(template: string, input: File) {
  var sourceModel = new SourceModel(input)
  
  var compiled = Handlebars.compile(template);
  return compiled({
      definitions: sourceModel.definitions
  });
};

export = ts2text;