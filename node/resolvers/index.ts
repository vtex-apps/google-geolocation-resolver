import providerLogo from './providerLogo'
import suggestAddresses from './suggestAddresses'
import getAddressByExternalId from './getAddressByExternalId'

export const resolvers = {
  Query: {
    providerLogo,
    suggestAddresses,
    getAddressByExternalId,
  },
}
