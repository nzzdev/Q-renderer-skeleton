const fs = require('fs');
const Enjoi = require('enjoi');
const Joi = require('joi');
const resourcesDir = __dirname + '/../../resources/';
const viewsDir = __dirname + '/../../views/';

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(fs.readFileSync(resourcesDir + 'schema.json', {
	encoding: 'utf-8'
}));
// ... and let Enjoi convert it to a Joi schema for validation 
const schema = Enjoi(schemaString);

// we use svelte to build tool specific markup
// first register it, second define the path of our core view template
require('svelte/ssr/register');
const staticTemplate = require(viewsDir + 'html-static.html');

module.exports = {
	method: 'POST',
	path: '/rendering-info/html-static',
	config: {
		validate: {
      options: {
        allowUnknown: true
      },
			payload: {
        // item gets validated against given schema
				item: schema,
        // one can pass further runtime configuration
        toolRuntimeConfig: Joi.object()
			}
		},
    cors: true
	},
	handler: function(request, reply) {
		let data = {
			stylesheets: [
				{
          // name of stylesheet will be used to call the correct stylesheet endpoint to load css
          // one can also specify a url instead which will result in loading css directly from that url
					name: 'default',
					type: 'critical'
				}
			], 
      // ...
			markup: staticTemplate.render(request.payload.item)
		}
		return reply(data);
	}
}
