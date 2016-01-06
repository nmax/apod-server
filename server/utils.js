const DAY = 1000 * 60 * 60 * 24;
exports.DAY = DAY;

exports.addDay = function addDay(date) {
  return new Date(date.getTime() + DAY);
};

exports.substractDay = function substractDay(date) {
  return new Date(date.getTime() - DAY);
};

exports.YYMMDDtoDate = function YYMMDDtoDate(yymmdd, sep='-') {
  let [year, month, day] = yymmdd.split(sep);
  return new Date(Date.UTC(year, month - 1, day));
};

 function dateToYYMMDD(date, sep='-') {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (('' + month).length < 2) {
    month = '0' + month;
  }

  if (( '' + day).length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join(sep);
}

exports.dateToYYMMDD = dateToYYMMDD;

exports.getTimespan = function getTimespan(offsetBeginOfTime, days, beginOfTime=Date.now()) {
  let start = new Date(beginOfTime - (offsetBeginOfTime * DAY));
  let end = new Date(start - (days * DAY));

  return {
    from: dateToYYMMDD(start),
    to: dateToYYMMDD(end)
  };
};
