import ApodRoute from './routes/apod';
import apodService from './services/apod';

import Hapi from 'hapi';

const server = new Hapi.Server({
  debug: {
    log: ['error'],
    request: ['error'],
  }
});
server.connection({ port: 3000 });

const defaultConfig ={
  json: {
    space: 2
  }
};

const namespace = 'api';

let apodRoute = new ApodRoute(apodService);

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
  handler: function (req, reply) {
    return apodRoute.index(req, reply);
  }
});

server.route({
  method: 'GET',
  path: `/${namespace}/apods/{date}`,
  config: defaultConfig,
  handler: function (req, reply) {
    return apodRoute.show(req, reply);
  }
});

server.route({
  method: 'GET',
  path: `/${namespace}/search`,
  config: defaultConfig,
  handler: function (req, reply) {
    return apodRoute.show(req, reply);
  }
});

server.start(() => {
  console.log('Server running at:', server.info.uri);
});
