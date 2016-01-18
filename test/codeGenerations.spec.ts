var ts2text = require('../lib/ts2text');
var vfsFake = require('vinyl-fs-fake');


describe("Code Genaration facilities", () => {
	it("should generate fully qualified methods", () => {
		let definition = 
		`
		declare namespace shared {
			namespace model {
				interface IUser {
					id: string,
					username: string
				}		
			}
			namespace service {
				interface BaseInterface {
					doSomething(done : (error: Error, result: string) => void ) : void;
				}		
					
				interface IUserService extends BaseInterface {
					list(done : (error: Error, users: model.IUser[]) => void ) : void;
				}		
			}
		}
		`
		let template = 
		`
		{{#definitions}}
		{{#if "kind=='interface' && name.endsWith('Service') "}}
		{{#block-params (eval "name.substring(1)") as | classname |}}
		{{#outputFile stem=classname extname="ts"}}
		/*{{firstLowercase classname}}*/
		class {{classname}} implements shared.service.{{name}} {
		
		{{#each methodSignatures}}
			{{{remove (nodetext) ';'}}} {
					console.log('siiii');
			}
		{{/each}}
		}
		/*{{{qualifiedName this}}}*/	
		/*{{{json this}}}*/
		{{/outputFile}}
		{{/block-params}}
		
		{{/if}}
		{{/definitions}}
		`
		ts2text({template: template, outputPath: 'output.ts'}, vfsFake.dest((files) => {
		console.log(files[0].contents.toString('utf8'))} ))		
		
	})
})