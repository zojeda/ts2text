{{#definitions}}
	{{#if "kind=='interface' && name.endsWith('Service') "}}
class Default{{eval "name.substring(1)"}} implements shared.service.{{name}} {

			{{#each methodSignatures}}
	{{{remove (nodetext) ';'}}} {
			console.log('siiii');
	}
			{{/each}}
}
	{{/if}}
{{/definitions}}
