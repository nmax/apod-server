import test from 'tape';
import diskSearchService from '../../../services/disk-search';
import Apod from '../../../models/apod';

test('diskSearchService#query', function (t) {
  t.plan(3);

  let query = diskSearchService.query('jupiter transit');

  t.equal(typeof query.then, 'function', 'returns a promise');

  query.then(function (searchResults) {
    let hasOnlyApods = searchResults.every((item) => item instanceof Apod);
    t.ok(Array.isArray(searchResults), 'resolve into an array');
    t.equal(hasOnlyApods, true, 'resolves into an array of apods');
  });

});
