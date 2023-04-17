const express = require('express');
const router = express.Router();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const { mailgunConfig } = require('../config/config');
const recaptchaMiddleware = require('../middleware/recaptchaMiddleware');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: mailgunConfig.apiKey });

router.get('/api', (req, res) => {
  const data = {
    message: 'hello world',
  };
  res.json(data);
});

router.post('/send-email', recaptchaMiddleware, (req, res) => {
// router.post('/send-email', (req, res) => {
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
    remarks,
  } = req.body;

  mg.messages
    .create(mailgunConfig.domain, {
      from: `Customer Email <${from}>`,
      to: to,
      subject: `${subject} for ${companyName}`,
      html: `    <!DOCTYPE html>
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
      </html>`,
    })
    .then((msg) => {
      res.status(200).send(`Email sent successfully, ${req.body}`);
      console.log(msg);
    })
    .catch((err) => {
      res.status(500).send('Error sending email');
      console.error(err);
    });
});

module.exports = router;