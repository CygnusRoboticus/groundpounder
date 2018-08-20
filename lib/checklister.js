const { checklist } = require('../template.json')

module.exports = class Checklister {
  constructor(context) {
    this.context = context;
    this.pullRequest = context.payload.pull_request;
  }
  isReady() {
    return !this.pullRequest.body.match(/\[\s\]/gmi);
  }
  hasChecklist() {
    return this.pullRequest.body.match(/\[(\s|x)\]/gmi)
  }
}
