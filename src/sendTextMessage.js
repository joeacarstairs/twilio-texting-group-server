/**
 * @param {Array<{name: string, number: string}>} subscriptions
 * @param {string} message
 */
function sendTextMessage(subscriptions, message) {
  for (const subscription of subscriptions) {
    const recipientNumber = subscription.number;
    console.warn(`
      TODO: send text message to ${recipientNumber}. Body: ${message}. End of message
    `);
  }
}

module.exports = { sendTextMessage };