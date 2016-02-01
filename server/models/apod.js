const fetch = require('node-fetch');
const API_KEY = process.env.NASA_API_KEY;
const STUPID_API_ERROR = "concept_tags functionality turned off in current service";

function dateToQueryFormat (date) {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return `${year}-${month}-${day}`;
}

function buildURL(queryDate) {
  return `https://api.nasa.gov/planetary/apod?concept_tags=true&api_key=${API_KEY}&date=${queryDate}&hd=true`;
}

function fetchApod(url) {
  return fetch(url).then((response) => response.json());
}

class Apod {

  static findLatest () {
    let queryDate = dateToQueryFormat(new Date());
    let url = buildURL(queryDate);
    return fetchApod(url)
      .then((data) => new Apod(data));
  }

  static find (id) {
    let url = buildURL(id);
    return fetchApod(url)
      .then((data) => new Apod(data));
  }

  static findMany (offsetDays, limit) {
    let batch = [];
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    for (let i = 0; i < limit; i += 1) {
      let date = new Date(Date.UTC(year, month, day - offsetDays - i));
      batch.push(dateToQueryFormat(date));
    }

    return Promise.all(batch.map((id) => Apod.find(id)));
  }

  constructor (data) {
    this.id = data.date;
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
