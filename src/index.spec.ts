import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { createSession, Message, receive } from './index.js'
chai.use(chaiAsPromised)

const testAPIKey = 'test-api-key'

describe('createSession', () => {
  it('should create session', () => {
    expect(createSession(testAPIKey)).to.have.property('close')
    expect(createSession(testAPIKey)).to.have.property('apiKey')
  })
})

describe('receive', () => {
  it('should throw if receiveFrom is not a known service', async () => {
    const session = createSession(testAPIKey)
    await expect(receive(session, 'unknown', () => undefined)).to.eventually.be.rejectedWith(Error)
  })

  it('should receive message', async () => {
    const session = createSession(testAPIKey)

    function handleMessage(message: Message) {
      console.log('Message:', message)
    }

    const phoneNumber = await receive(session, '+123456789', handleMessage, {
      timeout: 1000,
      closeAfter: 1
    })
    console.log(phoneNumber)
  })
})
