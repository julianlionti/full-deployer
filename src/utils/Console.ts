import chalk from 'chalk'
import {exit} from 'process'

const white = chalk.white
const green = chalk.green
const redBright = chalk.redBright
const greenBright = chalk.greenBright

const info = (text: string) => console.log(white(text))
const warn = (text: string) => console.log(chalk.white.inverse(text))
const start = (text: string) => console.log(green(text))

const end = (text: string) => {
  console.log(greenBright(text))
  console.log()
}

const error = (text: string, message: string) => {
  console.log(redBright(text))
  console.log(message)
  exit(0)
}

export default {
  start,
  end,
  error,
  info,
  warn,
}
