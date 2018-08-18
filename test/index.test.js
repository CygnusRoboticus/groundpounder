import { Application } from 'probot';
import groundpounder from '../index';
import prOpenedPayload from './fixtures/issues.opened.json';

import assert from 'assert';
import { describe, it } from 'mocha';
import sinon from 'sinon';

describe('Groundpounder', () => {
  let app, github

  beforeEach(() => {
    app = new Application()
    // Initialize the app based on the code from index.js
    app.load(groundpounder)
    // This is an easy way to mock out the GitHub API
    github = {
      issues: {
        createComment() {
          return Promise.resolve({});
        }
      }
    }
    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github)
  })

  it('creates a comment when an pullRequest is opened', async () => {
    const spy = sinon.spy(github.issues, 'createComment')
    await app.receive({
      event: 'pull_request.opened',
      payload: prOpenedPayload
    })

    assert(spy.called)
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/
