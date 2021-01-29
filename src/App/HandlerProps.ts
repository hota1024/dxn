import { ParseArgs, Tokenize } from '@/types/SchemaParser'

/**
 * HandlerProps type.
 */
export type HandlerProps<T extends string> = ParseArgs<Tokenize<T>>
