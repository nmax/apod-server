import test from 'tape';
import {
  DAY,
  addDay,
  substractDay,
  YYMMDDtoDate,
  dateToYYMMDD
} from '../..//utils';

test('day constant', function (t) {
  t.plan(2);

  t.ok(Number.isFinite(DAY), 'day is number');
  t.notOk(isNaN(DAY), 'its not NaN');
});

test('addDay method works', function (t) {
  t.plan(2);

  let birthday = new Date(Date.UTC(1991, 1, 16));
  let dayAfterMyBirthday = new Date(Date.UTC(1991, 1, 17));
  let result = addDay(birthday);

  t.ok(result instanceof Date, 'returns a date object');
  t.equal(result.getTime(), dayAfterMyBirthday.getTime(), 'adds a day');
});

test('substractDay method works', function (t) {
  t.plan(2);

  let birthday = new Date(Date.UTC(1991, 1, 16));
  let dayBeforeMyBirthday = new Date(Date.UTC(1991, 1, 15));
  let result = substractDay(birthday);

  t.ok(result instanceof Date, 'returns a date object');
  t.equal(result.getTime(), dayBeforeMyBirthday.getTime(), 'removes a day');
});

test('the YYMMDDtoDate method converts a yy-mm-dd datestring into a real date object', function (t) {
  t.plan(4);

  let birthday = '1991-02-16';
  let result = YYMMDDtoDate(birthday);

  t.ok(result instanceof Date, 'retuns a date object');
  t.equal(result.getFullYear(), 1991, 'has correct year');
  t.equal(result.getMonth(), 1, 'has correct month');
  t.equal(result.getDate(), 16, 'has correct day');
});

test('dateToYYMMDD converts a date object into a datestring', function (t) {
  t.plan(1);

  let birthday = new Date(Date.UTC(1991, 1, 16));
  let result = dateToYYMMDD(birthday);

  t.equal(result, '1991-02-16', 'returns a datestring');
});
