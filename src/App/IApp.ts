import { CommandHandler } from './CommandHandler'
import { CommandPrefix } from './CommandPrefix'
import { HandlerProps } from './HandlerProps'
import { PatternHandler } from './PatternHandler'

/**
 * App interface.
 */
export interface IApp {
  /**
   * add pattern handler.
   *
   * @param regexp pattern regular expression.
   * @param handler pattern handler.
   */
  pattern(regexp: RegExp, handler: PatternHandler): void

  /**
   * add command handler.
   *
   * @param schema schema string.
   * @param handler command handler.
   */
  command<S extends string>(
    schema: S,
    handler: CommandHandler<HandlerProps<S>>
  ): void

  /**
   * add a prefix.
   *
   * @param prefix prefix to add.
   */
  addPrefix(prefix: CommandPrefix): void

  /**
   * remove a prefix.
   *
   * @param prefix prefix to remove.
   */
  removePrefix(prefix: CommandPrefix): void

  /**
   * remove all prefixes.
   */
  removeAllPrefixes(): void

  /**
   * returns whether bot has given prefix.
   *
   * @param prefix prefix.
   */
  hasPrefix(prefix: CommandPrefix): boolean
}
