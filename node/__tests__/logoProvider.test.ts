import { AppManifest, Apps, IOContext } from '@vtex/api'

import getProviderLogo from '../resolvers/providerLogo'

interface MockContextProps {
  appVersion: string
  host: string
}

const mockContext = ({ appVersion, host }: MockContextProps): Context => {
  return {
    clients: {
      apps: {
        getApp: (_app: string) =>
          Promise.resolve({
            version: appVersion,
          } as AppManifest),
      } as Apps,
    },
    vtex: {
      host,
    } as IOContext,
  } as Context
}

describe('providerLogo', () => {
  beforeAll(() => {
    process.env.VTEX_APP_ID = 'vtex.google-geolocation-resolver@0.1.0'
  })

  it('should get logo for development environment', async () => {
    const { src, alt } = await getProviderLogo(
      {},
      {},
      mockContext({
        appVersion: '0.1.0+build1607022562',
        host: 'checkoutio.myvtex.com',
      })
    )

    expect(src).toBe(
      'https://checkoutio.myvtex.com/_v/private/assets/v1/linked/vtex.google-geolocation-resolver@0.1.0/public/logo.png'
    )
    expect(alt).toBe('Google logo')
  })

  it('should get logo for production environment', async () => {
    const { src, alt } = await getProviderLogo(
      {},
      {},
      mockContext({
        appVersion: '0.1.0',
        host: 'checkoutio.myvtex.com',
      })
    )

    expect(src).toBe(
      'https://checkoutio.myvtex.com/_v/public/assets/v1/published/vtex.google-geolocation-resolver@0.1.0/public/logo.png'
    )
    expect(alt).toBe('Google logo')
  })
})
