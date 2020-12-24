import {
  Status,
  AddressType,
  Place,
  AddressGeometry,
  Language,
} from '@googlemaps/google-maps-services-js'
import { Address, QueryAddressArgs } from 'vtex.geolocation-graphql-interface'

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

const getAddress = async (
  _: unknown,
  { externalId, sessionToken }: QueryAddressArgs,
  { clients: { apps, google }, vtex: { logger, locale } }: Context
): Promise<Address> => {
  const { apiKey } = await apps.getAppSettings(process.env.VTEX_APP_ID)

  if (!sessionToken) {
    logger.warn('No session token found. Additional charges may apply')
  }

  if (!Object.values(Language).includes(locale as Language)) {
    logger.warn(
      `"${locale}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
    )
  }

  const response = await google.placeDetails({
    params: {
      place_id: externalId,
      language: locale ? (locale as Language) : undefined,
      sessiontoken: sessionToken ?? undefined,
      fields: ['address_component', 'geometry'],
      key: apiKey,
    },
    timeout: 1000,
  })

  const { result: place, status } = response.data

  if (response.statusText !== 'OK' || status !== Status.OK) {
    logger.error(response)

    return {}
  }

  const country = getCountry(place)

  const rules = countryRules[country!]

  if (!rules) {
    logger.warn(`We don't have geolocation rules for the country: ${country}`)

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

        updatedAddress[checkoutFieldName] = component[geolocationField!.valueIn]

        return updatedAddress
      }

      return updatedAddress
    },
    baseAddress
  )
}

export default getAddress
