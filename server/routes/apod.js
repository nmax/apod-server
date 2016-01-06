const Apod = require('../models/apod');
const ApodsSerializer = require('../serializers/apod');


const ApodRoutes = {

  index (req, reply) {
    let offset = req.query.offset || 0;
    let limit = Math.min(req.query.limit || 10, 62);

    return Apod.findMany(offset, limit)
      .then((apods) => {
        let json = new ApodsSerializer(apods);
        reply(json).code(200);
      })
      .catch((error) => {
        reply(error).code(400);
      });
  }, 

  show (req, reply) {
    let id = req.params.date;
    return Apod.find(id)
      .then((apod) => {
        let json = new ApodsSerializer(apod);
        reply(json).code(200);
      })
      .catch((error) => {
        reply(error).code(400);
      });
  },

  search (req, reply) { } /*jshint ignore:line*/
};

module.exports = ApodRoutes;
