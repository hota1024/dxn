import { CommandHandler } from './CommandHandler'
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
}
