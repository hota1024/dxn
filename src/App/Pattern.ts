import { PatternHandler } from './PatternHandler'

/**
 * Pattern type.
 */
export type Pattern = {
  /**
   * pattern regular expression.
   */
  regexp: RegExp

  /**
   * pattern handler.
   */
  handler: PatternHandler
}
