import getSessionToken from '../resolvers/sessionToken'

describe('sessionToken', () => {
  it('should retrieve a non-empty token', async () => {
    const sessionToken = await getSessionToken({}, {}, {} as Context)

    expect(sessionToken).toBeTruthy()
  })

  it('should retrieve unique tokens', async () => {
    const firstSessionToken = await getSessionToken({}, {}, {} as Context)
    const secondSessionToken = await getSessionToken({}, {}, {} as Context)

    expect(firstSessionToken).not.toBe(secondSessionToken)
  })
})
