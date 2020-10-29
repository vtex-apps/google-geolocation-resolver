import { IOClients } from '@vtex/api'

import { Google } from './Google'

export class Clients extends IOClients {
  public get google() {
    return this.getOrSet('google', Google)
  }
}
