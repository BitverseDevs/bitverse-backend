
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// const allowedOrigins = [
//   'https://site.bitverseph.com',
// ];

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const databaseUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name';


const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming request origin:", origin); 
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  // preflightContinue: false, // Added 04.17
  // credentials: true, // Added 04.17
};

mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });


const mailgunConfig = {
  domain: process.env.MAILGUN_DOMAIN,
  apiKey: process.env.MAILGUN_API_KEY,
};

module.exports = {
  corsOptions,
  mailgunConfig,
  databaseUrl
};