import providerLogo from './providerLogo'
import { queries as searchQueries } from './search'

export const resolvers = {
  Query: {
    providerLogo,
    ...searchQueries,
  },
}
