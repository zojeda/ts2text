import * as ts from 'typescript';

export default class ModelDefinion {
  fileName: string;
  textSpan: ts.TextSpan;
  kind: string;
  name: string;
  containerKind: string;
  containerName: string;
  methodSignatures: ts.SignatureDeclaration[] = [];

  constructor(def: ts.DefinitionInfo) {
    this.fileName = def.fileName;
    this.textSpan = def.textSpan;
    this.kind = def.kind;
    this.name = def.name;
    this.containerKind = def.containerKind;
    this.containerName = def.containerName;
  }
  add(node: ts.Node) {
    if (this.textSpan.start <= node.getStart() && ((this.textSpan.start + this.textSpan.length) >= node.getEnd())) {
      switch (node.kind) {
        case ts.SyntaxKind.MethodSignature:
          this.methodSignatures.push((<ts.MethodDeclaration>node));
      }
    }
  }
}
