#!/usr/bin/env node
import {execSync} from 'child_process'
import clear from 'clear'
import {exit} from 'process'
import readline from 'readline'
import {about} from './utils/About'
import Backup from './utils/Backup'
import Configuration from './utils/Configuration'
import Git from './utils/Package'
import {buildProyect, sleep} from './utils/Misc'
import Server from './utils/Server'
import Package from './utils/Package'
import chalk from 'chalk'
import Console from './utils/Console'
import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'

const init = async () => {
  clear()
  about()

  const argv = await yargs(hideBin(process.argv)).argv
  const noBuild = argv.build === false ? true : false
  const noBackup = argv.backup === false ? true : false
  const noTag = argv.tag === false ? true : false
  const noPrompt = (argv.Y || argv.y || false) as boolean

  console.log()
  Console.warn('Initializing')
  console.log()
  const config = Configuration.readFile()

  if (!noBuild) {
    buildProyect(config)
  }

  await sleep()

  const server = new Server(config)
  await server.connect()

  await sleep()

  if (!noBackup) {
    await Backup.create(server, noTag, noPrompt)
  }

  await sleep()
  await server.uploadFiles()
  await server.restartPm2()
  server.close()

  console.log()
  about()
  Console.warn('Full-Deployer has finished succesfully')
  console.log()

  exit()
}

init()
