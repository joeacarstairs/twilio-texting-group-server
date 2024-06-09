/**
  * @type {string}
  * The route where the server will listen for incoming text messages from Twilio.
  * @example
  * export const route = '/sms';
  */
const route = '/sms';

/**
  * @type {number}
  * The port on which the server will listen for incoming text messages from Twilio.
  * @example
  * export const port = 3000;
  */
const port = 3000;

/**
  * @type {string}
  * The name of the app as it will be displayed to users. You don't need to
  * include the words 'texting group' or similar, as these are part of the
  * message template already. A short description of the event or group of
  * people works best.
  * @example
  * export const appName = "Joe Bloggs' hillwalking gang";
  * @example
  * export const appName = 'Glen Coe meet';
  */
const appName = 'Glen Coe meet';

module.exports = {
  route,
  port,
  appName,
};
