/*
The `src` have two variations, based on weather or not the app is in development (linked).
-  Development/linked: [...]/private/assets/v1/linked/[...]
- Production/released: [...]/public/assets/v1/published/[...]
*/
import { Image } from 'vtex.geolocation-graphql-interface'

// TODO: find a way to translate this to other idioms.
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
