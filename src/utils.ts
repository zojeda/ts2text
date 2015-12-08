export function objectExpression(expression, obj) {
  var result = `return ${expression} ;`;
  var args : string[] = Object.keys(obj);
  var conditionExpr = new Function(args.join(','), result);
  var argsValues = args.map(arg => obj[arg]);
  return conditionExpr.apply(obj, argsValues);
}
