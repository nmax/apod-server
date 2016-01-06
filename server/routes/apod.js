const Apod = require('../models/apod');
const ApodSerializer = require('../serializers/apod');


const ApodRoutes = {
  index (req, reply) {
    let offset = req.query.offset || 0;
    let limit = Math.min(req.query.limit || 10, 62);

    return Apod.findMany(offset, limit)
      .then((apods) => {
        let json = new ApodSerializer(apods);
        reply(json).code(200);
      })
      .catch((error) => {
        reply(error).code(error.status);
      });
  },

  show (req, reply) {
    let id = req.params.date;
    return Apod.find(id)
      .then((apod) => {
        let json = new ApodSerializer(apod);
        reply(json).code(200);
      })
      .catch((error) => {
        reply(error).code(error.status);
      });
  },

  search (req, reply) {
    reply('not yet implemented').code(501);
  }
};

module.exports = ApodRoutes;
