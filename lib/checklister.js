const { checklist } = require('../template.json')

module.exports = class Checklister {
  constructor(context) {
    this.context = context;
  }
  async create() {
    const lines = [checklist.tracker, ...checklist.lines],
      body = lines.join('\n');
    return await this.context.github.pullRequests.createReview({
      owner: this.owner,
      repo: this.repo,
      number: this.number,
      body,
      event: 'COMMENT'
    });
  }
  get owner() {
    return this.context.payload.repository.owner.login;
  }
  get repo() {
    return this.context.payload.repository.name;
  }
  get number() {
    return this.context.payload.pull_request.number;
  }
  async getChecklist() {
    if(this._review) {
      return this._review;
    }
    let reviews = await this.context.github.pullRequests.getReviews({
      owner: this.owner,
      repo: this.repo,
      number: this.number
    });
    reviews = reviews && reviews.data;
    for(let review of reviews) {
      if(this.isChecklist(review)) {
        this._review = review;
        return review;
      }
    }
  }
  async isReady() {
    const checklist = await this.getChecklist();
    if(checklist) {
      return !checklist.body.match(/\[\s\]/gm);
    }
  }
  isChecklist({ body }) {
    return body.includes(checklist.tracker);
  }
}
