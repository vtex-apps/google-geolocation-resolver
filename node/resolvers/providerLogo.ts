/*
The `src` have two variations, based on weather or not the app is in development (linked).
-  Development/linked: https://w0geo--checkoutio.myvtex.com/_v/private/assets/v1/linked/vtex.google-geolocation-resolver@0.1.0/public/logo.png
- Production/released: https://w0geo--checkoutio.myvtex.com/_v/public/assets/v1/published/vtex.google-geolocation-resolver@0.1.0/public/logo.png
*/
import { Image } from 'vtex.geolocation-graphql-interface'

const ALT_TEXT = 'Google logo'

const getProviderLogo = async (
  _: unknown,
  _args: unknown,
  ctx: Context
): Promise<Image> => {
  const {
    clients: { apps },
    vtex: { host },
  } = ctx

  const appId = process.env.VTEX_APP_ID
  const appManifest = await apps.getApp(appId)
  const linked = appManifest.version.includes('+')
  const visibility = linked ? 'private' : 'public'
  const status = linked ? 'linked' : 'published'
  const src = `https://${host}/_v/${visibility}/assets/v1/${status}/${appId}/public/logo.png`

  return { src, alt: ALT_TEXT }
}

export default getProviderLogo
