// Ideally, we should write to a file and read it at app start in case of crashes.
// An actual SQL database would probably be overkill.

const { readFileSync, writeFile } = require("fs");

/** @type Array<{ name: string, number: string }> */
const subscriptions = [];

/**
 * @param {string} number
 * @param {string} name
 */
function subscribe(number, name) {
  const subscription = { name, number };
  subscriptions.push(subscription);
  void save();
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

async function save() {
  try {
    await writeFile('../data.json', JSON.stringify({ subscriptions }));
  } catch (err) {
    if (typeof err === 'string') {
      console.error(`Error writing data: ${err}`);
    } else {
      console.error(`Error writing data: ${JSON.stringify(err)}`);
    }
  }
}

function load() {
  try {
    const data = JSON.parse(readFileSync('../data.json'));
    while (subscriptions.pop()) {}
    subscriptions.push(...data['subscriptions']);
  } catch (err){
    if (typeof err === 'string') {
      console.error(`Error reading data: ${err}`);
    } else {
      console.error(`Error reading data: ${JSON.stringify(err)}`);
    }
  }
}

module.exports = {
  subscribe,
  isSubscribed,
  getSubscriptions,
  getSubscriptionFromNumber,
  load,
};