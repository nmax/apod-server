const fetch = require('node-fetch');
const utils = require('../utils');

function findApod (id) {
  let url = `${utils.COUCH_URL}/${id}?include_doc=true`;
  return fetch(url)
    .then((r) => r.json())
    .then((data) => Apod.fromCouchRow(data.row));
}

const ApodRoutes = {

  index (req, reply) { }, /*jshint ignore:line*/

  show (req, reply) {
    let id = req.params.date;
    return findApod(id)
      .then((apod) => reply('==').code(200))
      .catch(function (error) {
        console.log('error');
        reply(error);
      });
  },

  search (req, reply) { } /*jshint ignore:line*/
};

module.exports = ApodRoutes;
