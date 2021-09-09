'use strict';

const fastify = require('fastify')();

fastify.register(require('fastify-swagger'), {
    openapi: {
        info: {
            title: 'Test swagger',
            description: 'testing the fastify swagger api',
            version: '0.1.0'
        },
        servers: [{
            url: 'http://localhost'
        }],
    },
    refResolver: {
        buildLocalReference(json, baseUri, fragment, i) {
            return json.$id || `def-${i}`;
        },
    },
    hideUntagged: true,
    exposeRoute: true
});

fastify.addSchema({
    $id: 'directItem',
    type: 'object',
    properties: {
        hello: {type: 'string'},
        item: {$ref: 'nestedItem'},
        items: {
            type: 'array',
            items: {$ref: 'nestedItem'}
        }
    }
});

fastify.addSchema({
    $id: 'nestedItem',
    type: 'object',
    properties: {
        hello: {type: 'string'}
    }
});

fastify.get('/get-nested', {
    schema: {
        description: 'get item with nested schema',
        tags: ['nested'],
        summary: '',
        response: {
            201: {
                description: 'Successful response',
                type: 'object',
                properties: {
                    withNested: {$ref: 'directItem'}
                }
            }
        }
    }
}, (req, reply) => {
    reply.send({});
});

fastify.listen(3000, err => {
    if (err) throw err;
    console.log('listening');
});
