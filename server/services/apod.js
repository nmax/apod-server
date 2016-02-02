import fetch from 'node-fetch';
import utils from '../utils';
import Apod from '../models/apod';

const API_KEY = process.env.NASA_API_KEY;

const ApodQueryService = {
  base: 'https://api.nasa.gov/planetary/apod',

  buildURL(queryDate, options={}) {
    let query = Object.assign({
      concept_tags: true,
      hd: true,
      api_key: API_KEY,
      date: queryDate
    }, options);

    return `${this.base}?concept_tags=${query.concept_tags}&api_key=${query.api_key}&date=${query.date}&hd=${query.hd}`;
  },

  fetchApod(url) {
    return fetch(url).then((response) => response.json());
  },

  findLatest () {
    let queryDate = utils.dateToYYMMDD(new Date());
    let url = this.buildURL(queryDate);
    return this.fetchApod(url)
      .then((data) =>  new Apod(data));
  },

  find (id) {
    let url = this.buildURL(id);
    return this.fetchApod(url)
      .then((data) =>  new Apod(data));
  },

  findMany (offsetDays, limit) {
    let batch = [];
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let day = now.getDate();

    for (let i = 0; i < limit; i += 1) {
      let date = new Date(Date.UTC(year, month, day - offsetDays - i));
      batch.push(utils.dateToYYMMDD(date));
    }

    return Promise.all(batch.map((id) => this.find(id)));
  }
};

export default ApodQueryService;
