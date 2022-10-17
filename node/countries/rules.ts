import { ISOAlpha3 } from './types'
import ARG from './ARG'
import BOL from './BOL'
import BRA from './BRA'
import USA from './USA'
import ROU from './ROU'

const rules: { [key in ISOAlpha3]?: Rules } = {
  ARG,
  BOL,
  BRA,
  USA,
  ROU,
}

export default rules
