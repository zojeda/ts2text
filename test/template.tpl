{{#definitions}}
	{{#if "kind=='interface' && name.endsWith('Service') "}}
	{{#block-params (eval "name.substring(1)") as | classname |}}
{{#outputFile stem=classname extname="ts"}}
class {{classname}} implements shared.service.{{name}} {

			{{#each methodSignatures}}
	{{{remove (nodetext) ';'}}} {
			console.log('siiii');
	}
			{{/each}}
}
{{/outputFile}}
	{{/block-params}}	
	{{/if}}
{{/definitions}}
