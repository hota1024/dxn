import { Command } from '@/App/Command'
import { ParseArgs, Tokenize } from '@/types/SchemaParser'
import { Client } from 'discord.js'
import { AppOption, defaultAppOption } from './AppOption'
import { CommandHandler } from './CommandHandler'
import { CommandPrefix } from './CommandPrefix'
import { IApp } from './IApp'
import { parseProps } from './parseProps'
import { Pattern } from './Pattern'
import { PatternHandler } from './PatternHandler'

/**
 * App class.
 */
export class App implements IApp {
  /**
   * Discord.js client.
   */
  readonly client: Client

  /**
   * patterns.
   */
  readonly patterns: Pattern[] = []

  /**
   * commands.
   */
  readonly commands: Command<string>[] = []

  /**
   * prefixes.
   */
  readonly prefixes: CommandPrefix[]

  /**
   * App constructor.
   */
  constructor(context: AppOption = defaultAppOption) {
    this.client = new Client()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.prefixes = context.prefixes ?? defaultAppOption.prefixes!

    this.client.on('message', (message) => {
      const content = message.content

      const pattern = this.patterns.find((p) => p.regexp.test(content))
      if (pattern) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const matches = content.match(pattern.regexp)!
        pattern.handler(message, matches, this)

        return
      }

      const prefix = this.prefixes.find((p) => {
        if (typeof p === 'string') {
          return content.startsWith(p)
        } else {
          return content.match(p)
        }
      })

      if (prefix) {
        let commandString = ''

        if (typeof prefix === 'string') {
          commandString = content.slice(prefix.length)
        } else {
          const matches = content.match(prefix)
          if (matches) {
            commandString = content.slice([0].length)
          }
        }

        const command = this.commands.find(
          (c) => !!parseProps(c.schema, commandString)
        )

        if (command) {
          const props = parseProps(command.schema, commandString)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          command.handler(message, props as any, this)
        }
      }
    })
  }

  pattern(regexp: RegExp, handler: PatternHandler): void {
    this.patterns.push({
      regexp,
      handler,
    })
  }

  command<S extends string>(
    schema: S,
    handler: CommandHandler<ParseArgs<Tokenize<S>>>
  ): void {
    this.commands.push({
      schema,
      handler,
    })
  }

  /**
   * login as bot.
   *
   * @param token bot token.
   */
  async login(token: string): Promise<string> {
    return this.client.login(token)
  }
}
