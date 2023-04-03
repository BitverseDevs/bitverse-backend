const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', function(req, res) {
  const data = {
    message: 'Hello, world!'
  };
  res.json(data);
});

app.post('/send-email', async (req, res) => {
  // Create a transporter object
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'bitverse001@gmail.com',
  //     pass: 'bitverse123456'
  //   }
  // });
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });


  // Define your email options
  const mailOptions = {
    from: 'bitverse001@gmail.com',
    to: req.body.to, // Get the recipient email from the request body
    subject: req.body.subject, // Get the email subject from the request body
    text: req.body.message // Get the email message from the request body
  };

  // Send the email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});


const port = process.env.PORT || 8888;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});

