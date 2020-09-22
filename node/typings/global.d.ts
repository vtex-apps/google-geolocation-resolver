import { ServiceContext } from '@vtex/api'

import { Clients } from '../clients'

declare global {
  type Context = ServiceContext & {
    clients: Clients
  }

  type AddressType =
    | 'residential'
    | 'commercial'
    | 'inStore'
    | 'giftRegistry'
    | 'pickup'
    | 'search'

  interface Address {
    addressId: string
    addressType: AddressType
    city: string | null
    complement: string | null
    country: string | null
    geoCoordinates: number[]
    neighborhood: string | null
    number: string | null
    postalCode: string | null
    receiverName: string | null
    reference: string | null
    state: string | null
    street: string | null
  }

  type AddressFields = keyof Address

  type AddressWithValidation = {
    [prop in AddressFields]: {
      value: Address[prop]
      valid?: boolean
    }
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

  interface MatchInterval {
    offset: number
    length: number
  }

  interface AddressSuggestion {
    description: string
    mainText: string
    mainTextMatchInterval: MatchInterval
    secondaryText: string
    externalId: string
  }

  namespace NodeJS {
    interface ProcessEnv {
      VTEX_APP_ID: string
    }
  }
}
