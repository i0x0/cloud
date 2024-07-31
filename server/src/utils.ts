import chalk from "chalk"

export const error = (x: unknown) => console.log(`${chalk.bold.red("[!]")} ${x}`)

export const ok = (x: unknown) => console.log(`${chalk.bold.green("[✓]")} ${x}`)

export const info = (x: unknown) => console.log(`${chalk.bold("[!]")} ${x}`)

export const warning = (x: unknown) => console.log(`${chalk.bold.yellow("[?]")} ${x}`)

//export const { hash, hashSync, verify, } = Bun.password