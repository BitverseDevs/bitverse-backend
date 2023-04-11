require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const app = express();
const cors = require('cors');
const Mailgun = require('mailgun.js');

const port = process.env.PORT || 8888;
const mailgun = new Mailgun(formData);
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY });

// const allowedOrigins = [
//     'http://localhost:3000', 
//     'https://site.bitverseph.com'
// ];

const allowedOrigins = [ 
    'https://site.bitverseph.com'
];

// const corsOption = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200
// };

const corsOption = {
    origin: function (origin, callback){
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};


app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', function(req, res) {
  const data = {
    message: "hello world",
  };
  res.json(data);
});

app.post('/send-email', (req, res) => {
  const {
    from,
    to,
    subject,
    fullName,
    email,
    companyName,
    contactNumber,
    numberOfEmployees,
    datePreferences,
    timePreferences,
    remarks
  } = req.body;

  mg.messages.create(DOMAIN, {
    from: `Customer Email <${from}>`,
    to: to,
    subject: `${subject} for ${companyName}`,
    // text: received,
    html: `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f1f1f1;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 130px 20px 20px 20px;
                position: relative;
            }
            .header {
                background-color: #1a237e;
                color: #ffffff;
                padding: 10px 20px;
                font-size: 24px;
                font-weight: bold;
                position: relative;
                z-index: 10;
                border-radius: 40px 10px 40px 10px / 20px 10px 20px 10px;
                text-align: center;
            }
            .info {
                margin-top: 20px;
                position: relative;
                z-index: 10;
            }
            .label {
                color: #1a237e;
                font-weight: bold;
            }
            .value {
                color: #424242;
            }
            .row {
                margin-bottom: 10px;
            }
            .logo {
                width: 100%;
                height: auto;
                display: block;
                margin-left: auto;
                margin-right: auto;
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
            }
        </style>
        </head>
        <body>
            <div class="email-container">
                <img src="https://site.bitverseph.com/assets/z-bv-banner-about.png" alt="Company Logo" class="logo">    
                <div class="header">
                Demo Request For: ${companyName}
                </div>
                <div class="info">
                    <div class="row">
                        <span class="label">Full Name:</span> <span class="value">${fullName}</span>
                    </div>
                    <div class="row">
                        <span class="label">Email:</span> <span class="value">${email}</span>
                    </div>
                    <div class="row">
                        <span class="label">Company Name:</span> <span class="value">${companyName}</span>
                    </div>
                    <div class="row">
                        <span class="label">Contact Number:</span> <span class="value">${contactNumber}</span>
                    </div>
                    <div class="row">
                        <span class="label">Number of Employees:</span> <span class="value">${numberOfEmployees}</span>
                    </div>
                    <div class="row">
                        <span class="label">Date Preference:</span> <span class="value">${datePreferences}</span>
                    </div>
                    <div class="row">
                        <span class="label">Time Preference:</span> <span class="value">${timePreferences}</span>
                    </div>
                </div>
                <pre style="background-color: #f1f1f1; padding: 10px; border-radius: 5px;">
                  Remarks: ${(remarks !== undefined ? remarks : 'Customer Did Not Specified any additional Remarks')}
                </pre>
            </div>
        </body>
    </html>
`
  })
  .then(msg => 
    {
    res.status(200).send(`Email sent successfully, ${req.body}`) 
    console.log(msg)
    }
    )
  .catch(err => {
    res.status(500).send('Error sending email');
    console.error(err)
    }
    );
});



app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});

