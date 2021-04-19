import { ClientOptions } from 'discord.js'
import { CommandPrefix } from './CommandPrefix'

/**
 * AppOption type.
 */
export type AppOption = {
  /**
   * prefixes.
   */
  prefixes?: CommandPrefix[]

  /**
   * discord.js client options.
   */
  clientOptions?: ClientOptions
}

export const defaultAppOption: AppOption = {
  prefixes: [],
}
