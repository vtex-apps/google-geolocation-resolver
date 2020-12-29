import {
  PlaceAutocompleteRequest,
  Status,
  PlaceAutocompleteResult,
  PlaceAutocompleteResponse,
} from '@googlemaps/google-maps-services-js'
import { Apps, IOClients, IOContext } from '@vtex/api'

import { Clients } from '../clients'
import { Google } from '../clients/Google'

export const defaultWarn = (_warning: unknown) => undefined
export const defaultPlaceAutocomplete = (_request: PlaceAutocompleteRequest) =>
  Promise.resolve({
    statusText: Status.OK,
    data: {
      predictions: [] as PlaceAutocompleteResult[],
    },
  } as PlaceAutocompleteResponse)

interface MockContextProps {
  locale?: string
  mockedWarn?: (warning: unknown) => void
  mockedPlaceAutocomplete?: (
    request: PlaceAutocompleteRequest
  ) => Promise<PlaceAutocompleteResponse>
}

export const mockContext = ({
  locale = undefined,
  mockedWarn = defaultWarn,
  mockedPlaceAutocomplete = defaultPlaceAutocomplete,
}: MockContextProps): Context =>
  ({
    clients: {
      google: {
        placeAutocomplete: mockedPlaceAutocomplete,
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
        warn: mockedWarn,
        error: (_error: unknown) => undefined,
      },
    } as IOContext,
  } as Context)
