var fetch = require('node-fetch');
var fs = require('fs');

const API_KEY = process.env.NASA_API_KEY;
const EARLIEST = '1996-06-16';
const EARLIEST_TS = fileNameToDate(EARLIEST);
const ONE_DAY = 1000 * 60 * 60 * 24;

function fileNameToDate (fileName) {
  let name = fileName.split('.')[0];
  let [year, month, day] = name.split('-');
  return Date.UTC(year, month - 1, day);
}

function previousDay (date) {
  return date - ONE_DAY;
}

function timestampToYYMMDD (ts) {
  let date = new Date(ts);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (('' + month).length < 2) {
    month = '0' + month;
  }

  if (( '' + day).length < 2) {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
}

function wait(timeout) {
  let promise = new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
  return promise;
}

function buildURL(date) {
  return `https://api.nasa.gov/planetary/apod?concept_tags=True&api_key=${API_KEY}&date=${date}&hd=true`;
}

function buildFileName(ts) {
  return timestampToYYMMDD(ts) + '.json';
}

fs.readdir('data', function (err, files) {
  let sortedByDateDec = files.sort(function (a, b) {
    let dateA = fileNameToDate(a);
    let dateB = fileNameToDate(b);
    return dateA < dateB;
  });

  let latestDateTS = fileNameToDate(sortedByDateDec[sortedByDateDec.length - 1]);
  let next = previousDay(latestDateTS);
  let remaining = [next];

  while (next >= EARLIEST_TS && remaining.length < 2000) {
    next = previousDay(next);
    let name = buildFileName(next);

    if (files.indexOf(name) === -1) {
      remaining.push(next);
    }
  }

  let downloads = remaining.map(function (ts) {
    let date = timestampToYYMMDD(ts);
    let url = buildURL(date);
    return { date, url };
  });

  Promise.all(downloads.map(function (download) {
    return wait(Math.random() * 60000)
      .then(() => fetch(download.url))
      .then((r) => r.json())
      .then(function (data) {
        let writeFile = new Promise((resolve, reject) => {
          fs.writeFile(`data/${download.date}.json`, JSON.stringify(data), 'utf8',  function (err) {
            if (err) {
              reject(err);
            }

            resolve();
          });
        });

        return writeFile;
      })
      .then(() => console.info(`Finished ${download.date}`));
  }))
  .then(() => console.log('done'))
  .catch((e) => console.log(e));

});

