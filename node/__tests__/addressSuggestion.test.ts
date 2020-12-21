import {
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  Status,
  PlaceAutocompleteResult,
} from '@googlemaps/google-maps-services-js'
import { Apps, IOClients, IOContext } from '@vtex/api'
import { QueryAddressSuggestionsArgs } from 'vtex.geolocation-graphql-interface'

import { Clients } from '../clients'
import { Google } from '../clients/Google'
import getAddressSuggestions from '../resolvers/addressSuggestions'

const mockArgs = (): QueryAddressSuggestionsArgs => ({
  searchTerm: 'search term',
  sessionToken: 'session token',
})

interface MockContextProps {
  locale: string
  warn: (warning: unknown) => void
}

const mockContext = ({ locale, warn }: MockContextProps): Context =>
  ({
    clients: {
      google: {
        placeAutocomplete: (_request: PlaceAutocompleteRequest) =>
          Promise.resolve({
            statusText: Status.OK,
            data: {
              predictions: [] as PlaceAutocompleteResult[],
            },
          } as PlaceAutocompleteResponse),
      } as Google,
      apps: {
        getAppSettings: (_app: string) =>
          Promise.resolve({
            apiKey: 'api key',
          } as { apiKey: string }),
      } as Apps,
    } as IOClients & Clients,
    vtex: {
      locale,
      logger: {
        warn,
        error: (_error: unknown) => undefined,
      },
    } as IOContext,
  } as Context)

describe('addressSuggestion', () => {
  it.each(['pt-BR', 'en'])(
    'shouldn\'t log "%s" as invalid language code',
    async (language: string) => {
      const mockWarn = jest.fn((_warning: unknown) => undefined)

      await getAddressSuggestions(
        {},
        mockArgs(),
        mockContext({ locale: language, warn: mockWarn })
      )

      expect(mockWarn).not.toBeCalledWith(
        `"${language}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
      )
    }
  )

  it.each(['pt_BR', ''])(
    'should log "%s" as invalid language code',
    async (language) => {
      const mockWarn = jest.fn((_warning: unknown) => undefined)

      await getAddressSuggestions(
        {},
        mockArgs(),
        mockContext({ locale: language, warn: mockWarn })
      )

      expect(mockWarn).toBeCalledWith(
        `"${language}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
      )
    }
  )
})
