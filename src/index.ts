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

const noBuild = false
const noBackup = false
const init = async () => {
  clear()
  about()

  const config = Configuration.readFile()

  if (!noBuild) {
    buildProyect(config)
  }

  await sleep()

  const server = new Server(config)
  await server.connect()

  await sleep()

  if (!noBackup) {
    await Backup.create(server)
  }

  await sleep()
  await server.uploadFiles()
  server.close()

  exit()
}

init()
