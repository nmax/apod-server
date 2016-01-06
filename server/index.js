const Hapi = require('hapi');

const server = new Hapi.Server({
  debug: {
    log: ['error'],
    request: ['error'],
  }
});
const ApodRoutes = require('./routes/apod');

server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply('Hello, world!');
    }
});

server.route({
  method: 'GET',
  path: '/apods',
  config: {
    json: {
      space: 2
    }
  },
  handler: ApodRoutes.index
});

server.route({
  method: 'GET',
  path: '/apods/{date}',
  config: {
    json: {
      space: 2
    }
  },
  handler: ApodRoutes.show
});

server.start(() => {
  console.log('Server running at:', server.info.uri);
});
