const template = require('../template.json')

module.exports = class Checker {
  constructor(context) {
    this.context = context;
    this.complete = false;
    this.success = false;
  }
  async create() {
    const result = await this.context.github.checks.create(this.createParams());
    return result;
  }
  async update(check) {
    const result = await this.context.github.checks.update(this.updateParams(check));
    return result;
  }
  createParams() {
    return this.context.repo({
      name: template.name,
      status: 'in_progress',
      output: {
        title: template.running.title,
        summary: template.running.summary
      },
      head_branch: this.branch,
      head_sha: this.sha,
      started_at: new Date()
    });
  }
  updateParams(check, { title, summary }) {
    check = check.data;
    return this.context.repo({
      name: template.name,
      status: 'completed',
      output: {
        title: this.success ?
          title.success :
          title.failure,
        summary: this.success ?
          summary.success :
          summary.failure
      },
      check_run_id: check.id,
      conclusion: this.success ? 'success' : 'failure',
      completed_at: new Date()
    });
  }
  get branch() {
    return this.context.payload.checksuite ?
      this.context.payload.checksuite.head_branch :
      this.context.payload.pull_request.head.ref;
  }
  get sha() {
    return this.context.payload.checksuite ?
      this.context.payload.checksuite.head_sha :
      this.context.payload.pull_request.head.sha;
  }
}
