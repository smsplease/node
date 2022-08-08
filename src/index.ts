import EventEmitter from 'events'
import fetch from 'node-fetch'

export interface Session {
  close: () => void
  apiKey: string
}

export interface Message {
  text: string
}

export function createSession(apiKey: string): Session {
  const session: Session = {
    apiKey,
    close: () => undefined
  }
  return session
}

interface InboxResponse {
  data: {
    phoneNumber: string
    service: string
    messages: Message[]
  }
}

interface PhoneNumberResponse {
  data: {
    phoneNumber: string
    token: string
  }
}

export interface Option {
  timeout: number
  closeAfter: number
}

export async function receive(
  session: Session,
  receiveFrom: string,
  handleMessage: (message: Message) => void,
  userOptions?: Partial<Option>
): Promise<string> {
  const options: Option = { timeout: 10 * 60 * 1000, closeAfter: 1, ...userOptions }

  let shouldPoll = false
  let lastMessagesLength = 0

  const response = await fetch(
    `https://api.veriskip.com/phone-numbers/${encodeURIComponent(receiveFrom)}`,
    {
      method: 'POST',
      headers: {
        'x-api-key': session.apiKey
      }
    }
  )

  if (response.status === 400) {
    throw new Error(`Unknown service: ${receiveFrom}`)
  }

  const timer = setTimeout(() => {
    if (shouldPoll) {
      throw new Error(`Timeout exceed while waiting for messages: ${options.timeout}`)
    }
  }, options.timeout)

  session.close = () => {
    clearTimeout(timer)
    shouldPoll = true
  }

  const json = (await response.json()) as PhoneNumberResponse
  const token = json.data.token
  const inbox = new EventEmitter()
  inbox.on('message', handleMessage)

  async function pollInbox() {
    if (!shouldPoll) {
      return
    }

    const response = await fetch(`https://api.veriskip.com/inbox`, {
      headers: {
        'x-api-key': session.apiKey,
        'x-auth-token': token
      }
    })

    const json = (await response.json()) as InboxResponse

    if (lastMessagesLength !== json.data.messages.length) {
      lastMessagesLength = json.data.messages.length
      inbox.emit('message', json.data.messages[0])
      if (lastMessagesLength > options.closeAfter) {
        shouldPoll = false
      }
    }

    pollInbox()
  }

  if (shouldPoll) {
    pollInbox()
  }

  return json.data.phoneNumber
}
