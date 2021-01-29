import { CommandHandler } from '@/App/CommandHandler'
import { ParseArgs, Tokenize } from '../types/SchemaParser'

/**
 * Command type.
 */
export type Command<S extends string> = {
  /**
   * Schema string.
   */
  schema: S

  /**
   * Command handler.
   */
  handler: CommandHandler<ParseArgs<Tokenize<S>>>
}
