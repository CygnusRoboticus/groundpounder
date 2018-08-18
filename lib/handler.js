const Checker = require('./checker')
const Checklister = require('./checklister')

module.exports = class Handler {
  constructor(context) {
    this.context = context;
  }
  async execute() {
    if(!this.context.payload.pull_request) {
      return;
    }

    const checklister = new Checklister(this.context),
      checklist = await checklister.getChecklist();
    const checker = new Checker(this.context),
      check = await checker.create();

    console.log(checklist);
    !checklist && await checklister.create();
    check.complete = true;
    check.success = await checklister.isReady();
    checker.update(check);
  }
}
