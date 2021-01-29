import { Message } from 'discord.js'
import { IApp } from './IApp'

/**
 * CommandHandler props.
 */
export type CommandHandler<P> = (message: Message, props: P, app: IApp) => void
