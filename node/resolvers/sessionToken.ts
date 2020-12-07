import { v4 as uuidv4 } from 'uuid'

const getSessionToken = async (
  _: unknown,
  _args: unknown,
  _ctx: Context
): Promise<string> => uuidv4()

export default getSessionToken
