import * as ts from 'typescript';

export default class MyLanguageServiceHost implements ts.LanguageServiceHost {
    files: { [fileName: string]: { file: ts.IScriptSnapshot; ver: number } } = {}

    log = _ => { };
    trace = _ => { };
    error = _ => { };
    getCompilationSettings = ts.getDefaultCompilerOptions;
    getScriptIsOpen = _ => true;
    getCurrentDirectory = () => "";
    getDefaultLibFileName = _ => "lib";

    getScriptVersion = fileName => {
        return this.files['./test/shared.d.ts'].ver.toString();
    }
    getScriptSnapshot = fileName => {
        return this.files['./test/shared.d.ts'].file;
    }

    getScriptFileNames(): string[] {
        var names: string[] = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    }

    addFile(fileName: string, body: string) {
        var snap = ts.ScriptSnapshot.fromString(body);
        snap.getChangeRange = _ => undefined;
        var existing = this.files[fileName];
        if (existing) {
            this.files[fileName].ver++;
            this.files[fileName].file = snap
          } else {
            this.files[fileName] = { ver: 1, file: snap };
        }
    }
    
}