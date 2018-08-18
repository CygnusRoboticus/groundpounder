const Handler = require('./lib/handler');

/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = function (app) {
  app.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.synchronize',
    'pull_request.edited'
  ], async context => {
    new Handler(context).execute();
  });
};
