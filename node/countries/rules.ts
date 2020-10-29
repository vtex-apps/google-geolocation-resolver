import { ISOAlpha3 } from './types'
import ARG from './ARG'
import BOL from './BOL'
import BRA from './BRA'
import USA from './USA'

const rules: { [key in ISOAlpha3]?: Rules } = {
  ARG,
  BOL,
  BRA,
  USA,
}

export default rules
