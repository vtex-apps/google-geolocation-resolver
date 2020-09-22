import { ParamsContext, RecorderState, Service } from '@vtex/api'
import schema from 'vtex.geolocation-graphql-interface/graphql'

import { Clients } from './clients'
import { resolvers } from './resolvers'

const DEFAULT_TIMEOUT_MS = 2 * 1000

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: DEFAULT_TIMEOUT_MS,
      },
    },
  },
  graphql: {
    schema,
    resolvers,
  },
})
