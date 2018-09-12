const Checker = require('./checker')
const Checklister = require('./checklister')
const template = require('../template.json')

module.exports = class Handler {
  constructor(context) {
    this.context = context;
    this.pullRequest = context.payload.pull_request;
  }
  execute() {
    if(!this.context.payload.pull_request) {
      return;
    }

    this.verifyChecklist();
    this.verifyConflicts();
  }

  async verifyChecklist() {
    const checklister = new Checklister(this.context);
    const checker = new Checker(this.context),
      check = await checker.create(template.checklist);

    checker.success = checklister.hasChecklist() && checklister.isReady();
    checker.update(check, template.checklist);
  }
  async verifyConflicts() {
    const checker = new Checker(this.context),
      check = await checker.create(template.conflict);
    checker.success = this.pullRequest.mergeable;
    checker.update(check, template.conflict);
  }
}
