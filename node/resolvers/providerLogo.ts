import { Image } from 'vtex.geolocation-graphql-interface'

// must be the same as assets/logo.png
const SRC_URL =
  'https://user-images.githubusercontent.com/26108090/100493516-45802680-3116-11eb-9028-06c336a587a7.png'

const ALT_TEXT = 'Google logo'

const getProviderLogo = async (): Promise<Image> => {
  return {
    src: SRC_URL,
    alt: ALT_TEXT,
  }
}

export default getProviderLogo
