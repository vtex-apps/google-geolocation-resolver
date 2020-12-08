import {
  Language,
  PlaceAutocompleteType,
  Status,
} from '@googlemaps/google-maps-services-js'
import { IOContext } from '@vtex/api'
import {
  AddressSuggestion,
  QuerySuggestAddressesArgs,
} from 'vtex.geolocation-graphql-interface'

function getLanguage(vtex: IOContext) {
  const language = vtex.locale?.replace('_', '-') ?? ''

  if (!(language in Language)) {
    vtex.logger.warn(
      `"${language}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
    )
  }

  return language as Language
}

const suggestAddresses = async (
  _: unknown,
  args: QuerySuggestAddressesArgs,
  ctx: Context
): Promise<AddressSuggestion[]> => {
  const { clients, vtex } = ctx
  const { searchTerm, sessionToken } = args
  const { apiKey } = await clients.apps.getAppSettings(process.env.VTEX_APP_ID)

  const client = clients.google

  if (!sessionToken) {
    vtex.logger.warn('No session token found. Additional charges may apply')
  }

  const response = await client.placeAutocomplete({
    params: {
      input: searchTerm,
      language: getLanguage(vtex),
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

export default suggestAddresses
