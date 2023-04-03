const express = require('express');
const app = express();

const port = 8888;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});

app.get('/api', function(req, res) {
  const data = {
    message: 'Hello, world!'
  };
  res.json(data);
});