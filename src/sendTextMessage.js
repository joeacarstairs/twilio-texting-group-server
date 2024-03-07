const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

/**
 * @param {Array<{name: string, number: string}>} subscriptions
 * @param {string} message
 */
function sendTextMessage(subscriptions, message) {
  for (const subscription of subscriptions) {
    const recipientNumber = subscription.number;
    client.messages.create({
      body: message,
      from: '+447481347623', // my Twilio phone number I bought
      to: subscription.number,
    }).then(message => console.debug(`Sent message ${message.sid} to ${message.to}`));
  }
}

module.exports = { sendTextMessage };