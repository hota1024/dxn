# dxn

schema base Discord.js framework.

```ts
import { App } from 'dxn'

const app = new App({
  prefixes: ['$'],
})

app.command('hello {name: string}', (message, { args }) => {
  message.reply(`hello ${args.name}!`)
})

app.login('<BOT_TOKEN>')
```

![スクリーンショット 2021-01-30 2 30 33](https://user-images.githubusercontent.com/24543982/106307796-22532e00-62a3-11eb-9056-51b8bfd1ea98.png)

![2021-01-30_1 55 15](https://user-images.githubusercontent.com/24543982/106304212-6db70d80-629e-11eb-807c-4f8627e3f3ed.png)

## ➕ Installation

```shell
yarn add dxn
# or
npm install dxn
```

## 🌟 Schema syntax

### Free word

RegExp:

```plain
/.+/
```

Sample:

```plain
hello
```

### Argument

RegExp:

```plain
\{[$_a-zA-Z][$_0-9a-zA-Z]*: [string|string?|number|number?|boolean|boolean?]\}
```

Sample:

```plain
{name: string}
{age: number}
{yes: boolean?}
```
