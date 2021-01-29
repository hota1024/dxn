import { isTypeString, TypeMap } from '@/types/SchemaParser'
import { HandlerProps } from './HandlerProps'

function createLocatedError(params: {
  input: string
  start: number
  end: number
  message: string
}) {
  const { input, start, end, message } = params
  const reset = '\x1b[0m'
  const red = '\x1b[31m'

  if (end - start === 1) {
    return new Error(
      `${input.slice(0, start)}${red}${input.slice(
        start,
        end
      )}${reset}${input.slice(end)}\n${red}${' '.repeat(start)}└─ ${message}`
    )
  }

  return new Error(
    `${input.slice(0, start)}${red}${input.slice(
      start,
      end
    )}${reset}${input.slice(end)}\n${red}${' '.repeat(start)}└${'─'.repeat(
      end - start - 2
    )}┴─ ${message}`
  )
}

/**
 * SchemaToken type.
 */
export type SchemaToken =
  | {
      kind: 'word'
      content: string
    }
  | {
      kind: 'arg'
      name: string
      type: keyof TypeMap
    }

/**
 * parse schema.
 */
export const parseSchema = (schema: string): SchemaToken[] => {
  const tokens: SchemaToken[] = []

  for (let i = 0; i < schema.length; ++i) {
    if (schema[i] === '{') {
      ++i
      const nameStart = i
      while (/[$_a-zA-Z][$_0-9a-zA-Z]*/.test(schema[i])) {
        ++i
      }

      const name = schema.slice(nameStart, i)

      if (schema[i] !== ':') {
        throw createLocatedError({
          input: schema,
          start: i,
          end: i + 1,
          message: `expected ':', but got '${schema[i]}'`,
        })
      }
      ++i

      if (schema[i] !== ' ') {
        throw createLocatedError({
          input: schema,
          start: i,
          end: i + 1,
          message: `expected space char, but got '${schema[i]}'`,
        })
      }
      ++i

      const typeStart = i
      do {
        ++i
        if (i > schema.length - 1) {
          throw createLocatedError({
            input: schema,
            start: schema.length - 1,
            end: schema.length,
            message: `expected '}', but got eof`,
          })
        }
      } while (schema[i] !== '}')

      const type = schema.slice(typeStart, i)

      if (!isTypeString(type)) {
        throw createLocatedError({
          input: schema,
          start: typeStart,
          end: i,
          message: `'${type}' is not supported.`,
        })
      }

      tokens.push({
        kind: 'arg',
        name,
        type: type,
      })
    } else if (schema[i] !== ' ' && i < schema.length) {
      const start = i
      while (schema[i] !== ' ' && i < schema.length) {
        ++i
      }

      tokens.push({
        kind: 'word',
        content: schema.slice(start, i),
      })
    }
  }

  return tokens
}

/**
 * InputToken type.
 */
export type InputToken =
  | {
      kind: 'string'
      value: string
    }
  | {
      kind: 'number'
      value: number
    }
  | {
      kind: 'boolean'
      value: boolean
    }

/**
 * parse input.
 */
export const parseInput = (input: string): InputToken[] => {
  const tokens: InputToken[] = []

  for (let i = 0; i < input.length; ++i) {
    if (input[i] === '"') {
      let escape = false
      const start = i
      ++i
      let value = ''

      while (true as const) {
        if (i > input.length - 1) {
          throw createLocatedError({
            input,
            start,
            end: i,
            message: 'unterminated string literal',
          })
        } else if (input[i] === '"' && !escape) {
          break
        } else if (input[i] === '\\') {
          escape = !escape
        } else {
          value += input[i]
          escape = false
        }

        ++i
      }

      ++i

      tokens.push({
        kind: 'string',
        value,
      })
    } else if (input[i] === ' ') {
      while (input[i] === ' ') {
        ++i
      }
    } else {
      let body = ''

      do {
        body += input[i]
        ++i
      } while (input[i] !== ' ' && i < input.length)

      if (body.match(/[0-9]+(\.[0-9]+)?/)) {
        tokens.push({
          kind: 'number',
          value: parseFloat(body),
        })
      } else if (body === 'true') {
        tokens.push({
          kind: 'boolean',
          value: true,
        })
      } else if (body === 'false') {
        tokens.push({
          kind: 'boolean',
          value: false,
        })
      } else {
        tokens.push({
          kind: 'string',
          value: body,
        })
      }
    }
  }

  return tokens
}

/**
 * parse command input.
 */
export const parseProps = <T extends string>(
  schema: T,
  input: string
): HandlerProps<T> | void => {
  const schemaTokens = parseSchema(schema)
  const inputTokens = parseInput(input)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const args: any = {}
  const argv: unknown[] = []

  for (let i = 0; i < schemaTokens.length; ++i) {
    const schemaToken = schemaTokens[i]
    const inputToken = inputTokens[i]

    if (typeof inputToken === 'undefined') {
      if (schemaToken.kind === 'arg' && schemaToken.type.endsWith('?')) {
        break
      } else {
        return
      }
    } else if (schemaToken.kind === 'word') {
      if (
        !(
          inputToken.kind === 'string' &&
          inputToken.value === schemaToken.content
        )
      ) {
        return
      }
    } else if (schemaToken.kind === 'arg') {
      if (schemaToken.type === inputToken.kind) {
        args[schemaToken.name] = inputToken.value
        argv.push(inputToken.value)
      } else if (schemaToken.type.endsWith('?')) {
        break
      } else {
        return
      }
    }
  }

  return {
    args,
    argv: argv as HandlerProps<T>['argv'],
  }
}
