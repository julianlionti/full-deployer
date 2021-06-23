import chalk from 'chalk'
import figlet from 'figlet'
import Console from './Console'

const white = chalk.white

export const about = () => {
  console.log(white(figlet.textSync('Full-Deployer', {horizontalLayout: 'full'})))
  console.log()
  Console.info('Developed by Julian Lionti')
  console.log()
}
