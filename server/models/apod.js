const fetch = require('node-fetch');
const config = require('../config');
const utils = require('../utils');

function queryCouchDB (url) {
  return fetch(url)
    .then((res) => {
      if (res.status > 200) {
        throw {
          type: 'query error',
          status: res.status
        };
      }
      return res.json();
    });
}

const STUPID_API_ERROR = "concept_tags functionality turned off in current service";

class Apod {

  static findLatest () {
    let url = `${config.COUCH_URL}/_design/days/_view/by_date?limit=1&descending=true&include_docs=false`;

    return queryCouchDB(url)
      .then((data) => new Apod(data.rows[0].value));
  }

  static find (id) {
    let url = `${config.COUCH_URL}/${id}`;

    return queryCouchDB(url)
      .then((data) => new Apod(data));
  }

  static findMany (offsetDays, limit) {
    return Apod.findLatest()
      .then(function (apod) {
        let beginOfTime = utils.YYMMDDtoDate(apod.id);
        let startYYMMDD = utils.dateToYYMMDD(utils.offsetTime(offsetDays, beginOfTime));
        let startkey = startYYMMDD.split('-').map((x) => parseInt(x, 10));
        let url = `${config.COUCH_URL}/_design/days/_view/by_date?startkey=[${startkey}]&limit=${limit}&include_docs=false&descending=true`;

        return queryCouchDB(url)
          .then((data) => data.rows.map(({ value }) => new Apod(value)));
      });
  }

  constructor (data) {
    this.id = data._id;
    this.title = data.title;
    this.url = data.url;
    this.hdurl = data.hdurl;
    this.mediaType = data.media_type;
    this.explanation = data.explanation;
    this.copyright = data.copyright;

    if (data.concepts && data.concepts !== STUPID_API_ERROR) {
      this.concepts = data.concepts;
    } else {
      this.concepts = [];
    }
  }
}

module.exports = Apod;
