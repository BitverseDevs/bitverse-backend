const express = require('express');
const app = express();
const emailRoutes = require('./routes/email');
const handleCors = require('./middleware/handleCors');
const handleError = require('./middleware/handleError');
const parseJson = require('./middleware/parseJson');

const port = process.env.PORT || 8888;

app.use(handleCors);
app.use(parseJson.urlencoded);
app.use(parseJson.json);

app.use('/', emailRoutes);

app.use(handleError);

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});