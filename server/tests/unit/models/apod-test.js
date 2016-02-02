const test = require('tape');
const Apod = require('../../../models/apod');
const fakeData = Object.freeze({
  date: 'this-gets-used-as-the-id',
  title: 'the title goes here',
  url: 'should be some valid url',
  hurl: 'should be some valid hd url',
  media_type: 'the media type',
  explanation: 'I dont even',
  copyright: 'cc by nc right?'
});

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

test('Apod#findLatest method exists', function (t) {
  t.plan(1);
  t.equal(typeof Apod.findLatest, 'function', 'it\'s a function');
});

test ('Apod#findLatest method returns a promise', function (t) {
  t.plan(1);
  let returnVal = Apod.findLatest();
  t.ok(returnVal instanceof global.Promise, 'it\'s a promise');
});

test ('Apod#find method exists', function (t) {
  t.plan(1);
  t.equal(typeof Apod.find, 'function', 'it\'s a function');
});

test ('Apod#find method returns a promise', function (t) {
  t.plan(1);
  let returnVal = Apod.find(123);
  t.ok(returnVal instanceof global.Promise, 'it\'s a promise');
});

test ('Apod#findMany method exists', function (t) {
  t.plan(1);
  t.equal(typeof Apod.findMany, 'function', 'it\'s a function');
});

test ('Apod#findMany method rturns a promise', function (t) {
  t.plan(1);
  let returnVal = Apod.findMany(123, 15);
  t.ok(returnVal instanceof global.Promise, 'it\'s a promise');
});

