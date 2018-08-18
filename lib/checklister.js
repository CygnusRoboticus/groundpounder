const { checklist } = require('../template.json')

module.exports = class Checklister {
  constructor(context) {
    this.context = context;
  }
  async create() {
    const lines = [checklist.tracker, ...checklist.lines],
      body = lines.join('\n');
    return await this.context.github.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      number: this.number,
      body
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
  async getComment() {
    if(this._comment) {
      return this._comment;
    }
    let comments = await this.context.github.issues.getComments({
      owner: this.owner,
      repo: this.repo,
      number: this.number
    });
    comments = comments && comments.data;
    for(let comment of comments) {
      if(this.isChecklist(comment)) {
        this._comment = comment;
        return comment;
      }
    }
  }
  async isReady() {
    const comment = await this.getComment();
    if(comment) {
      return !comment.body.match(/\[\s\]/gm);
    }
  }
  isChecklist({ body }) {
    return body.includes(checklist.tracker);
  }
}
