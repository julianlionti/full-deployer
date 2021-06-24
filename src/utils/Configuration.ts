import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import {exit} from 'process'

const warning = chalk.rgb(255, 69, 0)

export interface ConfigProps {
  protocol: string
  host: string
  port: number
  user: string
  pass: string
  buildScript: string
  deployDir: string
  destination: string
  backupsDir: string
  pm2proccessId: number
}

const readFile = (): ConfigProps => {
  const configName = 'deployerrc.json'
  const configFile = path.resolve(`./${configName}`)
  const exists = fs.existsSync(configFile)

  if (!exists) {
    console.log(warning('Configuration file not found'))
    console.log(
      warning(`File called '${configName}' must exists on root directory, exit`),
    )
    exit(0)
  }

  const file = fs.readFileSync(configFile)
  const json = JSON.parse(file.toString()) as ConfigProps

  return {
    ...json,
    port: json.port || 22,
    protocol: json.protocol || 'SFTP',
    buildScript: json.buildScript || 'build',
    deployDir: json.deployDir || 'build',
    backupsDir: json.backupsDir || '__bk',
    pm2proccessId: json.pm2proccessId || -1,
  }
}

export default {
  readFile,
}
