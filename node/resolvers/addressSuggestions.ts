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
  args: QueryAddressSuggestionsArgs,
  ctx: Context
): Promise<AddressSuggestion[]> => {
  const { clients, vtex } = ctx
  const { searchTerm, sessionToken } = args
  const { apiKey } = await clients.apps.getAppSettings(process.env.VTEX_APP_ID)

  const client = clients.google

  if (!sessionToken) {
    vtex.logger.warn('No session token found. Additional charges may apply')
  }

  if (!Object.values(Language).includes(vtex.locale as Language)) {
    vtex.logger.warn(
      `"${vtex.locale}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
    )
  }

  const response = await client.placeAutocomplete({
    params: {
      input: searchTerm,
      language: vtex.locale,
      types: PlaceAutocompleteType.address,
      sessiontoken: sessionToken ?? undefined,
      key: apiKey,
    },
    timeout: 1000,
  })

  if (response.statusText !== Status.OK) {
    vtex.logger.error(response)

    return []
  }

  return response.data.predictions.map(
    (googleSuggestion): AddressSuggestion => {
      return {
        description: googleSuggestion.description,
        mainText: googleSuggestion.structured_formatting.main_text,
        mainTextMatchInterval:
          googleSuggestion.structured_formatting
            .main_text_matched_substrings[0],
        secondaryText: googleSuggestion.structured_formatting.secondary_text,
        externalId: googleSuggestion.place_id,
      }
    }
  )
}

export default getAddressSuggestions
