import { queries as searchQueries } from './search'

export const resolvers = {
  Query: {
    ...searchQueries,
  },
}
