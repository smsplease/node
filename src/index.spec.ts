import { expect } from 'chai'
import { createSession } from './index.js'

const testAPIKey = 'test-api-key'

describe('createSession', () => {
  it('should create session', () => {
    expect(createSession(testAPIKey)).to.have.property('close')
    expect(createSession(testAPIKey)).to.have.property('apiKey')
  })
})

describe('receive', () => {})
