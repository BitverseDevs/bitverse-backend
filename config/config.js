
const dotenv = require('dotenv');
dotenv.config();

const allowedOrigins = [
  'https://site.bitverseph.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

const mailgunConfig = {
  domain: process.env.MAILGUN_DOMAIN,
  apiKey: process.env.MAILGUN_API_KEY,
};

module.exports = {
  corsOptions,
  mailgunConfig,
};