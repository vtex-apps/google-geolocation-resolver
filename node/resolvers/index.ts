import providerLogo from './providerLogo'
import sessionToken from './sessionToken'
import suggestAddresses from './suggestAddresses'
import getAddressByExternalId from './getAddressByExternalId'

export const resolvers = {
  Query: {
    providerLogo,
    sessionToken,
    suggestAddresses,
    getAddressByExternalId,
  },
}
