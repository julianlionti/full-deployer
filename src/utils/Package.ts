import {execSync} from 'child_process'
import fs from 'fs'
import path from 'path'
import Console from './Console'
import {prompt} from './Misc'

interface PackageProps {
  version: string
}

class Package {
  package: PackageProps
  pkgPath = path.resolve('./package.json')

  constructor() {
    const json = JSON.parse(fs.readFileSync(this.pkgPath).toString()) as PackageProps
    this.package = json
  }

  changeVersion = async () => {
    Console.info(
      'Do you want to update de package.json version? If not, no backup for that version will be created',
    )
    Console.info(`Last version is: ${this.package.version}`)
    const nextVersion = await prompt<string>('Next version (Leave it empty if not): ')

    if (nextVersion !== '' && nextVersion !== this.package.version) {
      Console.start('Modifyng package.json...')
      try {
        execSync(`npm version ${nextVersion}`)
      } catch (ex) {
        Console.error('Cannot upload version', '')
      }
      Console.start('package.json modified succesfully')
    }
  }
}

export default Package
