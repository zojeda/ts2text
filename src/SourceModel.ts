import _ = require('lodash');
import * as ts from 'typescript';

import File = require('vinyl');

import LanguageServiceHost from './LanguageServiceHost';
import ModelDefinition from './ModelDefinition';

export default class SourceModel {
  sourceFile: ts.SourceFile;
  sourceContent: string;
  languageService: ts.LanguageService;
  definitions: ModelDefinition[] = [];

  constructor(file: File) {
    this.sourceContent = file.contents.toString();
    this.sourceFile = ts.createSourceFile(file.path, this.sourceContent, ts.ScriptTarget.ES6, /*setParentNodes */ true);
    this.createDefinitions();
    this.createModel()
  }
  createModel() {
    var ntabs = 0;
    var self = this;
    transverse(this.sourceFile);
    function transverse(node: ts.Node) {
      ntabs++;
      self.definitions.forEach(def => {
        def.add(node);
      });
      ts.forEachChild(node, transverse);
      ntabs--;
    }

  }

  createDefinitions() {
    var host = new LanguageServiceHost();
    host.addFile(this.sourceFile.fileName, this.sourceContent);
    this.languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
    var classifications = this.languageService.getEncodedSemanticClassifications(this.sourceFile.fileName, { start: 0, length: this.sourceFile.end });

    var defs = classifications.spans
      .map(span => this.languageService.getDefinitionAtPosition(this.sourceFile.fileName, span) || [])
      .reduce((prev, curr) => prev.concat(curr))

    defs = _.uniq(defs, false, (value, index, array) => {
      for (let rindex = 0; rindex < index; rindex++) {
        if (_.isEqual(value, array[rindex])) return array[rindex]
      }
      return value
    });
    defs.forEach(def => this.definitions.push(new ModelDefinition(def)))

  }

}