const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

dotenv.config();

const { isSubscribed, getSubscriptions, getSubscriptionFromNumber, subscribe, load: loadData } = require('./db');
const { sendTextMessage } = require('./sendTextMessage');

loadData();
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
  `.replace(/\s+/g, ' '));

  if (isSubscribed(senderPhoneNumber)) {
    const senderSubscription = getSubscriptionFromNumber(senderPhoneNumber);
    const otherSubscriptions = getSubscriptions().filter(sub => sub.number !== senderPhoneNumber);

    const forwardedMessage = `${senderSubscription.name} said: ${body}`;
    sendTextMessage(otherSubscriptions, forwardedMessage);

    const abbreviatedBody = body.length > 16 ? `${body.slice(0, 14)}...` : body;
    const confirmationMessage = `
      Your message was forwarded to ${otherSubscriptions.length}
      recipients: "${abbreviatedBody}". Only you can see this message.
    `.replace(/\s+/g, ' ');
    sendTextMessage([senderSubscription], confirmationMessage);
  } else {
    if (body.toLocaleLowerCase().startsWith('my name is ') || body.toLocaleLowerCase().startsWith('my name is: ')) {
      const senderName = body.matchAll(/^my name is:? (.*)$/gi)?.next()?.value?.[1];

      if (!senderName) {
        const twiml = new MessagingResponse();
        twiml.message("Please provide a name. Syntax: my name is <your name>");
        res.type('text/xml').send(twiml.toString());
        return;
      }

      const subscription = subscribe(senderPhoneNumber, senderName);
      const welcomeMessage = `
        Well done, ${senderName}! You have successfully subscribed to the Glen
        Coe meet texting group. You will now be able to send and receive messages
        to and from the group.
      `.replace(/\s+/g, ' ');
      sendTextMessage([subscription], welcomeMessage);
    } else {
      const twiml = new MessagingResponse();
      twiml.message(`
        You are not subscribed to this texting group. To subscribe, send a
        text to this number with this syntax: my name is <your name>
      `.replace(/\s+/g, ' '));
      res.type('text/xml').send(twiml.toString());
      return;
    }
  }

  const twiml = new MessagingResponse();
  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
