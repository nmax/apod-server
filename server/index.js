const Hapi = require('hapi');
const server = new Hapi.Server();
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
  path: '/apod/{date}',
  handler: ApodRoutes.show
});

server.start(() => {
  console.log('Server running at:', server.info.uri);
});
