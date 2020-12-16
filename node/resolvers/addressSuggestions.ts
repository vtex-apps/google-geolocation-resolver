import {
  Language,
  PlaceAutocompleteType,
  Status,
} from '@googlemaps/google-maps-services-js'
import {
  AddressSuggestion,
  QueryAddressSuggestionsArgs,
} from 'vtex.geolocation-graphql-interface'

const getAddressSuggestions = async (
  _: unknown,
  { searchTerm, sessionToken }: QueryAddressSuggestionsArgs,
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

  const response = await google.placeAutocomplete({
    params: {
      input: searchTerm,
      language: locale,
      types: PlaceAutocompleteType.address,
      sessiontoken: sessionToken ?? undefined,
      key: apiKey,
    },
    timeout: 1000,
  })

  if (response.statusText !== Status.OK) {
    logger.error(response)

    return []
  }

  return response.data.predictions.map(
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
