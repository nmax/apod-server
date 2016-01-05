const nano = require('nano');
const fs = require('fs');

const COUCHDB_NAME = 'apod';
const COUCHDB_URL = 'http://localhost:5984';

const client = nano(COUCHDB_URL).use(COUCHDB_NAME);

fs.readdir('data', function (err, names) {
  if (err) {
    throw err;
  }

  let jsonFiles = names.filter(function (name) {
    return name.indexOf('.json') > -1;
  });

  importFiles(jsonFiles)
    .then(function () {
      console.log('done');
    })
    .catch(function (error) {
      console.error(error);
    });
});


function readFile (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf8', function (err, file) {
      return err ? reject(err) : resolve(file);
    });
  });
}


function importFiles (fileNames) {
  let files = fileNames.map(function (name) {
    return readFile(`data/${name}`)
      .then((text) => {
        return { name: name, content: JSON.parse(text) };
      });
  });

  return Promise.all(files)
    .then(function (files) {
      files.reduce(function (chain, data) {
        return chain.then(() => {
          let doc = Object.assign(data.content, {
            _id: data.name.split('.')[0],
            type: 'apod-day'
          });

          return new Promise((resolve, reject) => {
            client.insert(doc, function (err, body) {
              if (err) {
                reject(err);
              } else {
                resolve(body);
              }
            });
          });
        });
      }, Promise.resolve());
    });
}

