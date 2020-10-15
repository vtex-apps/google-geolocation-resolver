import { ServiceContext } from '@vtex/api'

import { Clients } from '../clients'

declare global {
  type Context = ServiceContext & {
    clients: Clients
  }

  interface GeolocationRule {
    valueIn: 'long_name' | 'short_name'
    types: string[]
    required?: boolean
    notApplicable?: boolean
    handler?: (
      address: Address,
      googleAddress: google.maps.GeocoderResult
    ) => Address
  }

  type GeolocationComponents =
    | 'postalCode'
    | 'street'
    | 'neighborhood'
    | 'state'
    | 'city'
    | 'number'

  type GeolocationRules = {
    [component in GeolocationComponents]?: GeolocationRule
  }

  interface Rules {
    geolocation: GeolocationRules
  }

  namespace NodeJS {
    interface ProcessEnv {
      VTEX_APP_ID: string
    }
  }
}
