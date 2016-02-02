const STUPID_API_ERROR = "concept_tags functionality turned off in current service";

class Apod {

  constructor (data) {
    this.id = data.date;
    this.title = data.title;
    this.url = data.url;
    this.hdurl = data.hdurl;
    this.mediaType = data.media_type;
    this.explanation = data.explanation;
    this.copyright = data.copyright;

    if (data.concepts && data.concepts !== STUPID_API_ERROR) {
      this.concepts = data.concepts;
    } else {
      this.concepts = [];
    }
  }
}

module.exports = Apod;
