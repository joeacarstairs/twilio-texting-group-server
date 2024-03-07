// Ideally, we should write to a file and read it at app start in case of crashes.
// An actual SQL database would probably be overkill.

/** @type Array<{ name: string, number: string }> */
const subscriptions = [];

/**
 * @param {string} number
 * @param {string} name
 */
export function subscribe(number, name) {
  subscriptions.push({ name, number });
}

/**
 * @param {string} number
 */
export function isSubscribed(number) {
  return subscriptions.some(s => s.number == number);
}

export function getSubscriptions() {
  /** @type Array<{ name: string, number: string }> */
  const clone = [];
  for (const subscription of subscriptions) {
    clone.push({ ...subscription });
  }
  return clone;
}