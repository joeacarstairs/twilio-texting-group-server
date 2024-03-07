const bodyParser = require('body-parser');
const express = require('express');
const { isSubscribed, getSubscriptions, getSubscriptionFromNumber } = require('./db');
const { sendTextMessage } = require('./sendTextMessage');
const { MessagingResponse } = require('twilio').twiml;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  /** @type {string} */
  const body = req.body.Body.trim();
  /** @type {string} */
  const senderPhoneNumber = req.body.From;
  /** @type {string} */
  const senderCountry = req.body.FromCountry;

  console.debug(`
    Received a text from ${senderCountry} on number ${senderPhoneNumber}.
    Message content: ${body}. End of message
  `);

  if (isSubscribed(senderPhoneNumber)) {
    const senderSubscription = getSubscriptionFromNumber(senderPhoneNumber);
    // TODO: enable filter. Just disabling so I can get the forwarded text to my own phone to check it works.
    const otherSubscriptions = getSubscriptions()/* .filter(sub => sub.number != senderPhoneNumber) */;

    const forwardedMessage = `${senderSubscription.name} said: ${body}`;
    sendTextMessage(otherSubscriptions, forwardedMessage);

    const abbreviatedBody = body.length() > 10 ? `${body.slice(0, 8)}...` : body;
    const confirmationMessage = `
      Your message was forwarded to ${otherSubscriptions.length()}
      recipients: "${abbreviatedBody}". Only you can see this message.
    `;
    sendTextMessage([senderSubscription], confirmationMessage);
  }

  const twiml = new MessagingResponse();
  twiml.message(JSON.stringify(body));
  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
