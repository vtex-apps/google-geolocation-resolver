import {
  Language,
  PlaceAutocompleteType,
  Status,
} from '@googlemaps/google-maps-services-js'
import {
  AddressSuggestion,
  QueryAddressSuggestionsArgs,
} from 'vtex.geolocation-graphql-interface'

import { isAlpha2, isAlpha3, toAlpha2 } from '../countries/ISO'
import { ISOAlpha3 } from '../countries/types'

const toValidCountry = (country?: string | null) => {
  let validCountry = country?.toUpperCase() ?? ''

  if (isAlpha3(validCountry)) {
    validCountry = toAlpha2(validCountry as ISOAlpha3)
  } else if (!isAlpha2(validCountry)) {
    validCountry = ''
  }

  validCountry = validCountry.toLowerCase()

  return validCountry || null
}

const getAddressSuggestions = async (
  _: unknown,
  { searchTerm, sessionToken, country }: QueryAddressSuggestionsArgs,
  { clients: { apps, google }, vtex: { logger, locale } }: Context
): Promise<AddressSuggestion[]> => {
  const { apiKey } = await apps.getAppSettings(process.env.VTEX_APP_ID)

  if (!sessionToken) {
    logger.warn('No session token found. Additional charges may apply')
  }

  if (!Object.values(Language).includes(locale as Language)) {
    logger.warn(
      `"${locale}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
    )
  }

  const validCountry = toValidCountry(country)

  if (country && !validCountry) {
    logger.warn(
      `"${country}" is not a valid country code. Use a two character, case insensitive, ISO 3166-1 Alpha-2 or Alpha-3 compatible country code instead.`
    )
  }

  const response = await google.placeAutocomplete({
    params: {
      input: searchTerm,
      language: locale,
      types: PlaceAutocompleteType.address,
      components: validCountry ? [`country:${validCountry}`] : undefined,
      sessiontoken: sessionToken ?? undefined,
      key: apiKey,
    },
    timeout: 1000,
  })

  if (response.statusText !== 'OK') {
    logger.error(response)

    return []
  }

  const { status, predictions } = response.data

  if (status !== Status.OK) {
    if (status === Status.ZERO_RESULTS) {
      logger.warn(response)
    } else {
      logger.error(response)
    }

    return []
  }

  return predictions.map(
    ({
      description,
      place_id: externalId,
      structured_formatting: {
        main_text: mainText,
        secondary_text: secondaryText,
        main_text_matched_substrings: [mainTextMatchInterval],
      },
    }): AddressSuggestion => {
      return {
        description,
        mainText,
        mainTextMatchInterval,
        secondaryText,
        externalId,
      }
    }
  )
}

export default getAddressSuggestions
