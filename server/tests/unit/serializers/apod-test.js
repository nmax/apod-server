const test = require('tape');
const Apod = require('../../../models/apod');
const ApodSerializer = require('../../../serializers/apod');

function createFakeModel (options={}) {
  const fakeData = Object.assign({
    date: 'this-gets-used-as-the-id',
    title: 'the title goes here',
    url: 'should be some valid url',
    hurl: 'should be some valid hd url',
    media_type: 'the media type',
    explanation: 'I dont even',
    copyright: 'cc by nc right?'
  }, options);

  return new Apod(fakeData);
}

test('apod serializer creates proper json-api-format json', function (t) {
  t.plan(1);
  let model = createFakeModel({
    date: '1991-02-01'
  });

  let expectedResult = {
    links: { self: 'http://localhost:3000/api/apods' },
    data: {
      type: 'apods',
      id: '1991-02-01',
     attributes: {
       title: 'the title goes here',
        url: 'should be some valid url',
        hdurl: undefined,
        'media-type': 'the media type',
        explanation: 'I dont even',
        copyright: 'cc by nc right?',
        concepts: [] },
     links: {
       self: 'http://localhost:3000/api/apods/1991-02-01',
       next: 'http://localhost:3000/api/apods/1991-02-02',
       previous: 'http://localhost:3000/api/apods/1991-01-31'
     }
    }
  };

  let json = new ApodSerializer(model);
  t.deepEqual(json, expectedResult, 'correct serialization result');
});
