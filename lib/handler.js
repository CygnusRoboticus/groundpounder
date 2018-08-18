const Checker = require('./checker')
const Checklister = require('./checklister')

module.exports = class Handler {
  constructor(context) {
    this.context = context;
  }
  async formatIssue() {
    let pr = this.context.payload.pull_request;
    if(pr) {
      const payload = await fetch(pr.url);
      pr = await payload.json();
      this.context.payload.pull_request = pr;
    }
    return this;
  }
  async execute() {
    if(!this.context.payload.pull_request) {
      return;
    }

    const checklister = new Checklister(this.context),
      checklist = await checklister.getComment();
    const checker = new Checker(this.context),
      check = await checker.create();

    !checklist && await checklister.create();
    checker.success = await checklister.isReady();
    checker.update(check);
  }
}
