const JSONAPISerializer = require('jsonapi-serializer');
const utils = require('../utils');

function getNextApodId (id) {
  let date = utils.YYMMDDtoDate(id);
  let nextDate = utils.addDay(date);

  if (nextDate.getTime() > Date.now()) {
    return null;
  }

  return utils.dateToYYMMDD(nextDate);
}

function getPreviousApodId (id) {
  let date = utils.YYMMDDtoDate(id);
  let nextDate = utils.substractDay(date);
  return utils.dateToYYMMDD(nextDate);
}

module.exports = class ApodSerializer extends JSONAPISerializer {

  constructor (model) {
    super('apod', model, {
      topLevelLinks: { self: 'http://localhost:3000/api/apods' },
      dataLinks: {
        self (apod) {
          return 'http://localhost:3000/api/apods/' + apod.id;
        },
        next (apod) {
          let nextId = getNextApodId(apod.id);
          if (nextId) {
            return 'http://localhost:3000/api/apods/' + nextId;
          } else {
            return null;
          }
        },
        previous (apod) {
          return 'http://localhost:3000/api/apods/' + getPreviousApodId(apod.id);
        }
      },
      attributes: ['copyright', 'explanation', 'title', 'url', 'hdurl', 'concepts', 'mediaType']
    });
  }
};

