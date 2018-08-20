const Checker = require('./checker')
const Checklister = require('./checklister')

module.exports = class Handler {
  constructor(context) {
    this.context = context;
    this.pullRequest = context.payload.pull_request;
  }
  async execute() {
    if(!this.context.payload.pull_request) {
      return;
    }

    const checklister = new Checklister(this.context);
    const checker = new Checker(this.context),
      check = await checker.create();

    checker.success = checklister.hasChecklist() && checklister.isReady();
    checker.update(check);
  }
}
