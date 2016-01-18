import * as ts from "typescript";
var CircularJSON = require('circular-json');

function compile(fileNames: string[], options: ts.CompilerOptions): void {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);


		let typeChecker = program.getTypeChecker();
    let dts = program.getSourceFiles()[1];

    var idNodes = getNodes(dts).filter(n=>n.kind===ts.SyntaxKind.InterfaceDeclaration);
    var typed = idNodes.map(n => {
      let type : any = typeChecker.getTypeAtLocation(n);
      let mem = type.symbol.members;
      let callSigs = type.getCallSignatures();
      let param1Type;
      var qs = getQualifiedSignatures(typeChecker, type).join("\n");
      return `${n.getText()} : ${qs}`;//CircularJSON.stringify(type.getCallSignatures()[0])
      
    }); 
    console.log(typed)


    process.exit(exitCode);
}
function getQualifiedSignatures(typeChecker, type) {
  let qualifiedSignatures = [];
  type.getApparentProperties().forEach(declaration => {
    var decString = declaration.name;
    if(declaration.valueDeclaration && declaration.valueDeclaration.parameters) {
      let qs = declaration.valueDeclaration.parameters.map(param => getQualifiedParameter(typeChecker, param))
      qualifiedSignatures.push(`${decString} (${qs})`);
    }  
  })
  return qualifiedSignatures;
}
function getQualifiedParameter(typeChecker, declarationParam) {
  return declarationParam.name.text + ' : (' + declarationParam.type.parameters.map(param => {
    let typeArg: any = typeChecker.getTypeAtLocation(param);
    if(typeArg.intrinsicName) {
      return `${param.name.text} :  ${typeArg.intrinsicName}`;
    } else {
      let t = typeChecker.getFullyQualifiedName(typeArg.symbol)
      if(typeArg.typeArguments) {
        let ta = typeArg.typeArguments.map(arg=>typeChecker.getFullyQualifiedName(arg.symbol)).join(',')
        return `${param.name.text} : ${t}<${ta}>`;
      } else {
        return `${param.name.text} : ${t}`;
      }
    }
    
  }).join(', ')+')'
}

function getNodes(sf: ts.SourceFile): ts.Node[] {
    var nodes: ts.Node[] = [];
    function allNodes(n: ts.Node) {
        ts.forEachChild(n, n => { nodes.push(n); allNodes(n); return false; })
    };
    allNodes(sf);
    return nodes;
}

compile(process.argv.slice(2), {
    noEmitOnError: true, noImplicitAny: true,
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});