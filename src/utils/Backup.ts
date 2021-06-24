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

  const bkList = (await sftp.list(full)).filter((e) => e.name.includes(bkDir))
  const bkNumber = bkList.length + 1

  if (bkDir === 'last') {
    const fullDatePath = slash(path.join(full, bkDir))
    await sftp.mkdir(fullDatePath)
    return fullDatePath
  }

  const now = new Date()
  const datedDir = `bk.${bkNumber}.-${now.getDate()}-${
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

const create = async (server: Server) => {
  try {
    const shouldBackup = await prompt<YesNoQuestion>(
      'Do you want to create a backup? n/Y',
    )
    if (shouldBackup === 'N') return

    const pk = new Package()
    const versionBkDir = await pk.changeVersion()

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
