import { CommandPrefix } from './CommandPrefix'

/**
 * AppOption type.
 */
export type AppOption = {
  /**
   * prefixes.
   */
  prefixes?: CommandPrefix[]
}

export const defaultAppOption: AppOption = {
  prefixes: [],
}
