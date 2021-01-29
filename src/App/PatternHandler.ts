import { Message } from 'discord.js'
import { IApp } from './IApp'

/**
 * PatternHandler type.
 */
export type PatternHandler = (
  message: Message,
  data: RegExpMatchArray,
  app: IApp
) => void
