import {
  Status,
  PlaceAutocompleteType,
  Language,
  AddressType,
  Place,
  AddressGeometry,
} from '@googlemaps/google-maps-services-js'
import { IOContext } from '@vtex/api'
import { Address, AddressSuggestion } from 'vtex.geolocation-graphql-interface'

import countryRules from '../countries/rules'
import { toAlpha3 } from '../countries/ISO'
import { ISOAlpha2 } from '../countries/types'

function revertRuleIndex(geolocationRules: GeolocationRules) {
  return Object.entries(geolocationRules).reduce<{
    [key: string]: GeolocationComponents
  }>((acc, [propName, rule]) => {
    for (let i = 0; i < rule!.types.length; i++) {
      const type = rule!.types[i]

      acc[type] = propName as GeolocationComponents
    }

    return acc
  }, {})
}

function getCountry(place: Place) {
  const countryComponent = place?.address_components?.find(
    (component) => component.types.indexOf(AddressType.country) !== -1
  )

  return countryComponent
    ? toAlpha3(countryComponent.short_name as ISOAlpha2)
    : null
}

function getLanguage(vtex: IOContext) {
  const language = vtex.locale?.replace('_', '-') ?? ''

  if (!(language in Language)) {
    vtex.logger.warn(
      `"${language}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
    )
  }

  return language as Language
}

export const queries = {
  getAddressByExternalId: async (
    _: unknown,
    args: { id: string },
    ctx: Context
  ): Promise<Address> => {
    const { clients, vtex } = ctx
    const { id } = args
    const { apiKey } = await clients.apps.getAppSettings(
      process.env.VTEX_APP_ID
    )

    const client = clients.google

    const response = await client.placeDetails({
      params: {
        place_id: id,
        language: getLanguage(vtex),
        key: apiKey,
      },
      timeout: 1000,
    })

    if (response.statusText !== Status.OK) {
      vtex.logger.error(response)
    }

    const { result: place } = response.data

    const country = getCountry(place)

    const rules = countryRules[country!]

    if (!rules) {
      vtex.logger.warn(
        `We don't have geolocation rules for the country: ${country}`
      )

      return {} as Address
    }

    const geolocationRules = rules.geolocation

    const indexedRules = revertRuleIndex(geolocationRules)

    if (!place.address_components) {
      return {} as Address
    }

    const {
      location: { lng, lat },
    } = place.geometry as AddressGeometry

    const baseAddress = {
      addressId: '1',
      addressType: 'residential',
      geoCoordinates: [lng, lat],
      country,
    } as Address

    return place.address_components.reduce<Address>(
      (updatedAddress: Address, component) => {
        const mappedType = component.types.find((type) => indexedRules[type])
        const checkoutFieldName = mappedType ? indexedRules[mappedType] : null

        if (checkoutFieldName) {
          const geolocationField = geolocationRules[checkoutFieldName]

          updatedAddress[checkoutFieldName] =
            component[geolocationField!.valueIn]

          return updatedAddress
        }

        return updatedAddress
      },
      baseAddress
    )
  },

  suggestAddresses: async (
    _: unknown,
    args: { searchTerm: string },
    ctx: Context
  ): Promise<AddressSuggestion[]> => {
    const { clients, vtex } = ctx
    const { searchTerm } = args
    const { apiKey } = await clients.apps.getAppSettings(
      process.env.VTEX_APP_ID
    )

    const client = clients.google

    const response = await client.placeAutocomplete({
      params: {
        input: searchTerm,
        language: getLanguage(vtex),
        types: PlaceAutocompleteType.address,
        key: apiKey,
      },
      timeout: 1000,
    })

    if (response.statusText !== Status.OK) {
      vtex.logger.error(response)

      return []
    }

    return response.data.predictions.map((googleSuggestion) => {
      const suggestion: AddressSuggestion = {
        description: googleSuggestion.description,
        mainText: googleSuggestion.structured_formatting.main_text,
        mainTextMatchInterval:
          googleSuggestion.structured_formatting
            .main_text_matched_substrings[0],
        secondaryText: googleSuggestion.structured_formatting.secondary_text,
        externalId: googleSuggestion.place_id,
      }

      return suggestion
    })
  },
}
