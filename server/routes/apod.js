import ApodSerializer from '../serializers/apod';

export default class ApodRouter {

  constructor (apodService, diskSearchService) {
    this.apodService = apodService;
    this.diskSearch = diskSearchService;
  }

  index (req, reply) {
    let offset = req.query.offset || 0;
    let limit = Math.min(req.query.limit || 10, 62);

    return this.apodService.findMany(offset, limit)
      .then((apods) => {
        let json = new ApodSerializer(apods);
        reply(json).code(200);
      })
      .catch((error) => {
        reply(error).code(error.status);
      });
  }

  show (req, reply) {
    let id = req.params.date;
    return this.apodService.find(id)
      .then((apod) => {
        let json = new ApodSerializer(apod);
        reply(json).code(200);
      })
      .catch((error) => {
        reply(error).code(error.status);
      });
  }

  search (req, reply) {
    let searchTerm = req.query.q;
    if (!searchTerm || searchTerm.length < 3) {
      return reply({
        type: 'bad request',
        error: 'search param q must at least have a length of 3 characters'
      }).code(400);
    }

    return this.diskSearch.query(searchTerm)
      .then(function (apods) {
        let json = new ApodSerializer(apods);
        reply(json).code(200);
      })
      .catch(function (error) {
        reply(error).code(500);
      });
  }
}
