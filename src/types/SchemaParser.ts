type Optional<T> = T | undefined

type TypeMap = {
  string: string
  'string?': Optional<string>
  number: number
  'number?': Optional<number>
  boolean: boolean
  'boolean?': Optional<boolean>
}

type TypeKey = keyof TypeMap

type ArgSchema<N extends string, T> = {
  name: N
  type: T
}

type ErrorMessage<M> = { message: M }

type ParseError<T extends string> = [ErrorMessage<T>]

type NotTypeError<T extends string> = ParseError<`'${T}' is not a type string.`>

/**
 * Tokenize type.
 */
export type Tokenize<
  T extends string
> = T extends `{${infer Name}: ${infer Type}} ${infer A}`
  ? Type extends TypeKey
    ? [ArgSchema<Name, TypeMap[Type]>, ...Tokenize<A>]
    : NotTypeError<Type>
  : T extends `{${infer Name}:${infer Type}} ${infer A}`
  ? Type extends TypeKey
    ? [ArgSchema<Name, TypeMap[Type]>, ...Tokenize<A>]
    : NotTypeError<Type>
  : T extends `{${infer Name}: ${infer Type}}`
  ? Type extends TypeKey
    ? [ArgSchema<Name, TypeMap[Type]>]
    : NotTypeError<Type>
  : T extends `{${infer Name}:${infer Type}}`
  ? Type extends TypeKey
    ? [ArgSchema<Name, TypeMap[Type]>]
    : NotTypeError<Type>
  : T extends `${infer T} ${infer A}`
  ? [T, ...Tokenize<A>]
  : [T]

type FilterArgs<T extends unknown[]> = T extends [infer F, ...infer A]
  ? F extends ArgSchema<infer Name, infer Type>
    ? Name extends string
      ? { [K in Name]: Type } & FilterArgs<A>
      : never
    : FilterArgs<A>
  : unknown

type Argv<T extends unknown[]> = T extends [infer F, ...infer A]
  ? F extends ArgSchema<string, infer Type>
    ? [Type, ...Argv<A>]
    : Argv<A>
  : []

/**
 * ParseArgs type.
 */
export type ParseArgs<T extends unknown[]> = {
  /**
   * call arguments.
   */
  args: FilterArgs<T>

  /**
   * argument values.
   */
  argv: Argv<T>
}
