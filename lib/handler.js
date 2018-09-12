const Checker = require('./checker')
const Checklister = require('./checklister')
const template = require('../template.json')

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
    if(!checker.success) {
      checker.update(check, template.checklist);
      return;
    }

    checker.success = this.pullRequest.mergeable;
    if(!checker.success) {
      checker.update(check, template.conflict);
      return
    }
  }
}
