import test from 'tape';
import service from '../../../services/apod';
import {fakeData} from '../../fixtures';
import sinon from 'sinon';
import Apod from '../../../models/apod';

function stubApiRequest (returnVal) {
  let stub = sinon.stub(service, 'fetchApod');
  if (returnVal) {
    stub.returns(returnVal);
  }

  return stub;
}

test('service#findLatest method exists', function (t) {
  t.plan(1);
  t.equal(typeof service.findLatest, 'function', 'it\'s a function');
});

test('service#findLatest method returns a promise', function (t) {
  t.plan(1);

  let stub = stubApiRequest(Promise.resolve(fakeData));

  let returnVal = service.findLatest();
  t.ok(returnVal instanceof global.Promise, 'it\'s a promise');

  stub.restore();
});

test('the promise returned from service#findLatest resolves into an apod instance', function (t) {
  t.plan(2);
  let fakeApiResponse = {
    date: "2002-02-02"
  };
  let stub = stubApiRequest(Promise.resolve(fakeApiResponse));

  return service.findLatest('2002-02-02')
    .then(function (apod) {
      t.ok(apod instanceof Apod, 'its an apod instance');
      t.equal(apod.id, '2002-02-02', 'it probably has all the right properties');
      stub.restore();
    });
});

test('service#find method exists', function (t) {
  t.plan(1);
  t.equal(typeof service.find, 'function', 'it\'s a function');
});

test('service#find method returns a promise', function (t) {
  t.plan(1);
  let stub = stubApiRequest(Promise.resolve(fakeData));

  let returnVal = service.find(123);
  t.ok(returnVal instanceof global.Promise, 'it\'s a promise');

  stub.restore();
});

test('the promise returned from service#find resolves into an apod instance', function (t) {
  t.plan(2);
  let fakeApiResponse = {
    date: "2002-02-02"
  };
  let stub = stubApiRequest(Promise.resolve(fakeApiResponse));

  return service.find('2002-02-02')
    .then(function (apod) {
      t.ok(apod instanceof Apod, 'its an apod instance');
      t.equal(apod.id, '2002-02-02', 'it probably has all the right properties');
      stub.restore();
    });
});

test('service#findMany method exists', function (t) {
  t.plan(1);
  t.equal(typeof service.findMany, 'function', 'it\'s a function');
});

test('service#findMany method returns a promise', function (t) {
  t.plan(1);
  let stub = stubApiRequest(Promise.resolve([fakeData, fakeData]));

  let returnVal = service.findMany(123, 15);
  t.ok(returnVal instanceof global.Promise, 'it\'s a promise');

  stub.restore();
});

test('the promise returned from service#findMany resolves into many apod instances', function (t) {
  t.plan(4);
  let fakeApiResponse = { date: '2002-02-02'};
  let stub = stubApiRequest(Promise.resolve(fakeApiResponse));

  return service.findMany(192, 2) // offset, limit
    .then(function (apods) {
      t.ok(apods[0] instanceof Apod, 'its an apod instance');
      t.equal(apods[0].id, '2002-02-02', 'it probably has all the right properties');
      t.ok(apods[1] instanceof Apod, 'its an apod instance');
      t.equal(apods[1].id, '2002-02-02', 'it probably has all the right properties');
      stub.restore();
    });
});
