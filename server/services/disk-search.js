import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import Apod from '../models/apod';

function readFile (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf8', function (err, file) {
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
    let ag = spawn('ag', [searchTerm,
                   '-l', // return filename of match
                   '-i',  // ignore case
                   '-Q',  // disable pattern matching / match literal instead
                   'data/']);

    return new Promise (function (resolve, reject) {

      ag.stdout.on('data', (data) => {
        matches += data.toString('utf-8');
      });

      ag.stderr.on('error', (error) => reject(error));

      ag.on('close', () => {
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
