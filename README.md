# SMSplease.com SDK

## How to use?

- You cannot receive an SMS unless **you know the sender** with this library.
- The sender can be a phone number (eg.: +1123456789), or a service (eg.: Facebook, WhatsApp). See the supported services at:: https://smsplease.com/services.json

  - [See how to receive SMS from a phone number](https://github.com/smsplease..)
  - [See how to receive SMS from a service](https://github.com/smsplease..)

- The service is free, build on smsplease.com API
- Please consult the Terms and Conditions at https://smsplease.com/terms-and-conditions.txt

# [Get your free token from smsplease.com](https://smsplease.com)

## Command line

```bash
npx @smsplease/cli <Number or service to receive from>
```

### Receive from phone number

```bash
$ npx @smsplease/cli +1123456789
```

### Receive from a service

```bash
$ npx @smsplease/cli WhatsApp
```

## Receive SMS from a phone number

```typescript
import { receive, createSession } from '@smsplease/node'

const message = await new Promise((resolve) => {
  const session = createSession('YOUR TOKEN')

  function handleMessage(message: Message) {
    session.close()
    resolve(message)
  }

  const receiveFrom = '+1123456789'
  const temporaryPhoneNumber = await receiveSMS(session, receiveFrom, handleMessage)

  console.log(`Your temporary phone number to send TO: ${temporaryPhoneNumber}`)
  console.log(`Waiting for a message FROM: ${receiveFrom}`)
})

console.log(message)
```

## Receive SMS from an online service, like WhatsApp, Facebook

```typescript
import { receive, createSession } from '@smsplease/node'

const message = await new Promise((resolve) => {
  const session = createSession()

  function handleMessage(message: Message) {
    session.close()
    resolve(message)
  }

  const receiveFrom = 'Facebook'
  const temporaryPhoneNumber = await receiveSMS(session, receiveFrom, handleMessage)

  console.log(`Your temporary phone number to send TO: ${temporaryPhoneNumber}`)
  console.log(`Waiting for a message FROM: ${receiveFrom}`)
})

console.log(message)
```
