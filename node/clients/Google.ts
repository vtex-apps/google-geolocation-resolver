import {
  Client,
  PlaceAutocompleteRequest,
  PlaceDetailsRequest,
} from '@googlemaps/google-maps-services-js'
import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'
import axios from 'axios'

export class Google extends ExternalClient {
  private client: Client
  private baseUrl = 'http://maps.googleapis.com'
  private routes = {
    placeAutocomplete: `${this.baseUrl}/maps/api/place/autocomplete/json`,
    placeDetails: `${this.baseUrl}/maps/api/place/details/json`,
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)

    const axiosInstance = axios.create({
      ...options,
      baseURL: this.baseUrl,
      headers: {
        ...options?.headers,
        'x-vtex-use-https': 'true',
        'proxy-authorization': context.authToken,
      },
    })

    this.client = new Client({ axiosInstance })
  }

  public placeAutocomplete(request: PlaceAutocompleteRequest) {
    return this.client.placeAutocomplete({
      ...request,
      url: this.routes.placeAutocomplete,
    })
  }

  public placeDetails(request: PlaceDetailsRequest) {
    return this.client.placeDetails({
      ...request,
      url: this.routes.placeDetails,
    })
  }
}
