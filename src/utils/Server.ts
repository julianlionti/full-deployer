import {ConfigProps} from './Configuration'
import Client from 'ssh2-sftp-client'
import Console from './Console'
import {Presets, SingleBar} from 'cli-progress'
import path from 'path'
import {slash} from './Paths'
import {countFiles, sleep} from './Misc'

class Server {
  sftp: Client
  config: ConfigProps
  constructor(config: ConfigProps) {
    this.sftp = new Client()
    this.config = config
    return this
  }

  connect = async () => {
    const {host, user, port, pass} = this.config
    try {
      Console.start('Connecting to server...')
      await this.sftp.connect({host, port, username: user, password: pass})
      Console.end('Connected!')
    } catch (ex) {
      Console.error('Could not connect to server', ex.message)
    }
    return this
  }

  uploadFiles = async () => {
    Console.start('Uploading files...')
    await sleep(1000)
    const {destination, deployDir} = this.config
    try {
      const buildDir = slash(path.resolve(`./${deployDir}`))
      const finalDestination = slash(destination)

      const totalFiles = countFiles(buildDir)
      const progress = new SingleBar(
        {
          format:
            'Uploading Files: [{bar}] {percentage}% | ETA: {eta}s | Files: {value}/{total}',
        },
        Presets.shades_classic,
      )
      progress.start(totalFiles, 0)

      let filesUploaded = 0
      this.sftp.on('upload', (info) => {
        filesUploaded++
        progress.update(filesUploaded)
        if (filesUploaded === totalFiles) {
          progress.stop()
          Console.end('Files uploaded successfully')
        }
      })

      await this.sftp.uploadDir(buildDir, finalDestination)
    } catch (ex) {
      Console.error('Could not upload files to server', ex.message)
    }
  }

  close = () => {
    this.sftp.end()
  }
}

export default Server
