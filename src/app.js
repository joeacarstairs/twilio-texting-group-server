const bodyParser = require('body-parser');
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  /** @type {string} */
  const body = req.body;
  const twiml = new MessagingResponse();
  twiml.message(JSON.stringify(body));
  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
