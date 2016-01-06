const fetch = require('node-fetch');
const config = require('../config');
const utils = require('../utils');

class Apod {

  static find (id) {
    let url = `${config.COUCH_URL}/${id}?include_doc=true`;
    console.log(url);
    return fetch(url)
      .then((r) => r.json())
      .then((data) => {
        return new Apod(data);
      });
  }

  static findMany (offset, limit) {
    let {from, to} = utils.getTimespan(offset, limit);
    let toInt = ((x) => parseInt(x, 10));
    let startkey = from.split('-').map(toInt);
    let endkey = to.split('-').map(toInt);
    let url = `${config.COUCH_URL}/_design/days/_view/by_date?startkey=[${startkey}]&endkey=[${endkey}]&include_docs=true&descending=true`;
    console.log(url);

    return fetch(url)
      .then((r) => r.json())
      .then((data) => {
        return data.rows.map(function (row) {
          return new Apod(row.doc);
        });
      });
  }

  constructor (data) {
    this.id = data._id;
    this.title = data.title;
    this.url = data.url;
    this.hdurl = data.hdurl;
    this.mediaType = data.media_type;
    this.concepts = data.concepts || [];
    this.explanation = data.explanation;
  }
}

module.exports = Apod;
