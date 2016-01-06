const Hapi = require('hapi');

const server = new Hapi.Server({
  debug: {
    log: ['error'],
    request: ['error'],
  }
});
const ApodRoutes = require('./routes/apod');
server.connection({ port: 3000 });

const defaultConfig ={
  json: {
    space: 2
  }
};

const namespace = 'api';

server.route({
  method: 'GET',
  path: '/',
  config: defaultConfig,
  handler: function (request, reply) {
    let links = {
      self: `http://localhost:3000/${namespace}/`,
      apods: `http://localhost:3000/${namespace}/apods`,
      search: `http://localhost:3000/${namespace}/search`
    };
    reply({
      links
    });
  }
});

server.route({
  method: 'GET',
  path: `/${namespace}/apods`,
  config: defaultConfig,
  handler: ApodRoutes.index
});

server.route({
  method: 'GET',
  path: `/${namespace}/apods/{date}`,
  config: defaultConfig,
  handler: ApodRoutes.show
});

server.route({
  method: 'GET',
  path: `/${namespace}/search`,
  config: defaultConfig,
  handler: ApodRoutes.search
});


server.start(() => {
  console.log('Server running at:', server.info.uri);
});
