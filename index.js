const express = require('express');
const nodemailer = require('nodemailer');
const app = express();



app.get('/api', function(req, res) {
  const data = {
    message: 'Hello, world!'
  };
  res.json(data);
});

app.post('/send-email', (req, res) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bitverse001@gmail.com',
      pass: 'bitverse123456'
    }
  });

  // Define your email options
  const mailOptions = {
    from: 'youremail@gmail.com',
    to: req.body.to, // Get the recipient email from the request body
    subject: req.body.subject, // Get the email subject from the request body
    text: req.body.message // Get the email message from the request body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
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

