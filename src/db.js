// Ideally, we should write to a file and read it at app start in case of crashes.
// An actual SQL database would probably be overkill.

/** @type Array<{ name: string, number: string }> */
const subscriptions = [];

/**
 * @param {string} number
 * @param {string} name
 */
function subscribe(number, name) {
  const subscription = { name, number };
  subscriptions.push(subscription);
  return subscription;
}

/**
 * @param {string} number
 */
function isSubscribed(number) {
  return subscriptions.some(s => s.number === number);
}

function getSubscriptions() {
  /** @type Array<{ name: string, number: string }> */
  const clone = [];
  for (const subscription of subscriptions) {
    clone.push({ ...subscription });
  }
  return clone;
}

/**
 * @param {string} number
 */
function getSubscriptionFromNumber(number) {
  return subscriptions.find(sub => sub.number === number);
}

module.exports = {
  subscribe,
  isSubscribed,
  getSubscriptions,
  getSubscriptionFromNumber,
};