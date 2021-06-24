import {ConfigProps} from './Configuration'
import Client from 'ssh2-sftp-client'
import {Client as SSHClient} from 'ssh2'
import Console from './Console'
import {Presets, SingleBar} from 'cli-progress'
import path from 'path'
import {slash} from './Paths'
import {countFiles, sleep} from './Misc'

class Server {
  sftp: Client
  ssh: SSHClient
  config: ConfigProps

  constructor(config: ConfigProps) {
    this.sftp = new Client()
    this.ssh = new SSHClient()
    this.config = config
    return this
  }

  connect = async () => {
    const {host, user, port, pass} = this.config
    try {
      Console.start('Connecting to server...')
      await this.sftp.connect({host, port, username: user, password: pass})
      await new Promise((res) => {
        this.ssh.connect({host, port, username: user, password: pass})
        this.ssh.on('ready', res)
      })
      Console.end('Connected!')
    } catch (ex) {
      Console.error('Could not connect to server', ex.message)
    }
    return this.sftp
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
    return this.sftp
  }

  restartPm2 = async () => {
    const {pm2proccessId} = this.config
    if (pm2proccessId < 0) return

    return new Promise((res) => {
      Console.start('Restarting PM2 proccess')
      this.ssh.exec(`pm2 restart ${pm2proccessId}`, (err, st) => {
        if (err) Console.error('Proccess could not be restarted: ', err.message)

        st.on('close', (code: number) => {
          if (code === 0) Console.end('PM2 proccess restarted succesfully')
          res(true)
        })
          .on('data', (data: any) => Console.info(data))
          .stderr.on('data', (data: string) =>
            Console.error('Proccess could not be restarted: ', data),
          )
      })
    })
  }

  close = () => {
    this.sftp.end()
    this.ssh.end()
  }
}

export default Server
