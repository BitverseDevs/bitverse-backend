const bodyParser = require('body-parser');

module.exports = {
  urlencoded: bodyParser.urlencoded({ extended: false }),
  json: bodyParser.json(),
};