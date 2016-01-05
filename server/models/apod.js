class Apod {

  static fromCouchDrow (row) {
    let apod = new Apod();
    Object.assign(apod, row);
    return apod;
  }

  constructor () {
    this.foobaz = 'alalal';
  }

  serialize () {
    return 'bazi';
    //return JSON.stringify(this);
  }

  get links () {
    return {
      self: 'http://somelink'
    };
  }

}

module.exports = Apod;
