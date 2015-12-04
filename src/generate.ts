import _ = require('lodash');
import * as ts from 'typescript';
import {readFileSync} from "fs";

import LanguageServiceHost from './LanguageServiceHost';

import SyntaxKind from './syntaxKind';


_.templateSettings.evaluate = /{{([\s\S]+?)}}/g;
var template = "{{ this.out(src.statements[0].body.statements[1].body.statements[0]) }}"

//readFileSync('./test/template.tpl').toString()

var host = new LanguageServiceHost();
host.addFile('./test/shared.d.ts', readFileSync('./test/shared.d.ts').toString());
var languageService = ts.createLanguageService(host, ts.createDocumentRegistry());

var file = getSourceFile('./test/shared.d.ts', console.error);
var locals = {
        definition: function out(node: ts.Node) {
             var def = languageService.getTypeDefinitionAtPosition('test/shared.d.ts', node.getStart());
        },

        out: function out(msg) {
                console.log('============== ', msg)
        }
        
}
var compiled = _.template(template).bind(locals);
console.log(compiled({src: file}));

//createTree(file);

var scs = languageService.getSemanticClassifications('test/shared.d.ts', {start: 0, length: file.end});

scs
  .filter(sc => sc.classificationType=='interface name')
  .map(sc => languageService.getDefinitionAtPosition('test/shared.d.ts', sc.textSpan.start))
  .forEach(def => {
         console.log(def);
  })




function createTree(sourceFile: ts.SourceFile) {
        var ntabs = 0;        
        transverse(sourceFile);
        var definition = [];
        function transverse(node: any) {
                ntabs++;
                var def: any = languageService.getDefinitionAtPosition('test/shared.d.ts', node.getStart());
                if(def && def instanceof Array) {
                        for(let d of def) {
                                console.log(_.repeat('\t', ntabs), d);  
                        }  
                }      
                ts.forEachChild(node, transverse);
                ntabs--;
        }
        var modules :any= sourceFile.statements[0];

}


function getSourceFile(fileName: string, onError?: (message: string) => void) {
        return ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
}


