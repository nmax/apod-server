const test = require('tape');
const Apod = require('../../../models/apod');
import {fakeData} from '../../fixtures';

test ('Apod constructor exists and creates apod objects', function (t) {
  t.plan(2);

  t.ok(Apod, 'it exists');
  let astroPic = new Apod(fakeData);
  t.ok(astroPic instanceof Apod, 'returns an apod object');
});

test('the apod constructor sets various properties on creation', function (t) {
  t.plan(8);

  function hasProp (prop) {
    return `has correct property ${prop}`;
  }

  let astroPic = new Apod(fakeData);
  t.equal(astroPic.id, fakeData.date, hasProp('id'));
  t.equal(astroPic.title, fakeData.title, hasProp('title'));
  t.equal(astroPic.url, fakeData.url, hasProp('url'));
  t.equal(astroPic.hdurl, fakeData.hdurl, hasProp('hdurl'));
  t.equal(astroPic.mediaType, fakeData.media_type, hasProp('mediaType'));
  t.equal(astroPic.explanation, fakeData.explanation, hasProp('explanation'));
  t.equal(astroPic.copyright, fakeData.copyright, hasProp('copyright'));
  t.deepEqual(astroPic.concepts, [], hasProp('concepts'));
});


