import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import Apod from '../models/apod';

function readFile (filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf8', function (err, file) {
      return err ? reject(err) : resolve(file);
    });
  });
}

function pathToApod (filePath) {
  return readFile(filePath)
    .then(function (file) {
      let data = JSON.parse(file);
      data.date = path.basename(filePath, '.json');
      return new Apod(data);
    });
}

const diskSearchService = {

  query (searchTerm) {
    let matches = '';
    let search = spawn('apod-searcher/target/release/apod-searcher', [searchTerm, 'data/']);

    return new Promise (function (resolve, reject) {

      search.stdout.on('data', (data) => {
        matches += data.toString('utf-8');
      });

      search.stderr.on('error', (error) => reject(error));

      search.on('close', () => {
        // filter empty lines
        let filePaths = matches.split('\n')
                               .filter((match) => match && match.length > 0);

        // read each file from disk and convert it into an apod model object
        Promise.all(filePaths.map((filePath) => pathToApod(filePath)))
          .then((apods) => resolve(apods))
          .catch((error) => reject(error));
      });

    });
  }

};

  export default diskSearchService;
