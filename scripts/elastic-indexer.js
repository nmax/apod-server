let fetch = require('node-fetch');

const COUCHDB_NAME = 'apod';
const COUCHDB_URL = 'http://localhost:5984';
const ELASTIC_INDEX = 'http://localhost:9200/apod/external';


function indexDoc (data) {
  let id = data._id;
  data.date = id;
  delete data._id;
  return fetch(`${ELASTIC_INDEX}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    .then((resp) => resp.json())
    .then((json) => console.log(json));
}

fetch(`${COUCHDB_URL}/${COUCHDB_NAME}/_all_docs?include_docs=true`)
  .then((response) => response.json())
  .then((json) => {
    return json.rows.reduce(function (seq, row) {
      if (row.error || !row.doc) {
        return seq.then(() => Promise.resolve());
      }

      return seq.then(() => indexDoc(row.doc));
    }, Promise.resolve());
  })
  .then(() => console.log('done'))
  .catch(() => console.error(error));
