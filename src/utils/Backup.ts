import Server from '../utils/Server'
import path from 'path'
import {slash} from './Paths'
import Console from './Console'
import {prompt, YesNoQuestion} from './Misc'
import Package from './Package'

const mkBkDir = async (server: Server, bkDir: string) => {
  const {config, sftp} = server
  const {destination} = config
  const full = slash(path.join(destination, config.backupsDir))

  const exists = await sftp.exists(full)
  if (!exists) {
    Console.start('Creating first backup')
    await sftp.mkdir(full)
  }

  if (bkDir === 'noversion') {
    const fullDatePath = slash(path.join(full, bkDir))
    await sftp.mkdir(fullDatePath)
    return fullDatePath
  }

  const now = new Date()
  const datedDir = `bk.v${bkDir}-${now.getDate()}-${
    now.getMonth() + 1
  }-${now.getFullYear()}`

  const fullDatePath = slash(path.join(full, datedDir))
  await sftp.mkdir(fullDatePath)

  return fullDatePath
}

const moveFiles = async (server: Server, backpath: string) => {
  const {sftp, config} = server
  const {destination} = config

  try {
    const files = await sftp.list(destination)
    for await (const file of files) {
      if (file.name === config.backupsDir) continue
      const actualPath = slash(path.join(destination, file.name))
      const finalPath = slash(path.join(backpath, file.name))
      await sftp.rename(actualPath, finalPath)
    }
  } catch (ex) {
    console.error('Cannot move files to destination', ex.message)
  }
}

const create = async (server: Server, noTag: boolean, noPrompt: boolean) => {
  try {
    if (!noPrompt) {
      const shouldBackup = await prompt<YesNoQuestion>(
        'Do you want to create a backup? n/Y',
      )
      if (shouldBackup === 'N') return
    }

    const versionBkDir = await Package.changeVersion(noTag)

    Console.start('Creating backup... Please wait')

    const finalpath = await mkBkDir(server, versionBkDir)
    await moveFiles(server, finalpath)

    Console.end('Backup created succesfully')
  } catch (ex) {
    console.error('Cannot create backup', ex.message)
  }
}

export default {
  create,
}
