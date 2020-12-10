import providerLogo from './providerLogo'
import sessionToken from './sessionToken'
import suggestAddresses from './suggestAddresses'
import address from './address'

export const resolvers = {
  Query: {
    providerLogo,
    sessionToken,
    suggestAddresses,
    address,
  },
}
