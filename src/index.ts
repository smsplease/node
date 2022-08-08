export interface Session {
  close: () => void
}

export interface Message {
  text: string
}

export function createSession(): Session {
  const session = {
    close: () => undefined
  }
  return session
}

export async function receiveSMS(
  session: Session,
  receiveFrom: string,
  handleMessage: (message: Message) => void
): Promise<string> {
  const phoneNumber = 'Initial'
  return phoneNumber
}
