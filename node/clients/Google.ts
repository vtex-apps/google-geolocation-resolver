import {
  Client,
  PlaceAutocompleteRequest,
  PlaceDetailsRequest,
} from '@googlemaps/google-maps-services-js'
import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

export class Google extends ExternalClient {
  private externalClient: Client

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
    this.externalClient = new Client()
  }

  public placeAutocomplete(request: PlaceAutocompleteRequest) {
    return this.externalClient.placeAutocomplete(request)
  }

  public placeDetails(request: PlaceDetailsRequest) {
    return this.externalClient.placeDetails(request)
  }
}
