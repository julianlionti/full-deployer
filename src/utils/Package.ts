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
      'Before deploying, do you want to update de package.json version? If not, the backup generated will not be versioned',
    )
    Console.info(`Last version is: ${this.package.version}`)
    const nextVersion = await prompt<string>('Next version (Leave it empty if not): ')

    if (nextVersion !== '' && nextVersion !== this.package.version) {
      Console.start('Modifyng package.json...')
      try {
        execSync(`npm  version ${nextVersion}`)
        execSync(`git push origin v${nextVersion}`)
      } catch (ex) {
        Console.error('Cannot upload version', '')
      }
      Console.end('package.json modified succesfully')
      return nextVersion
    }

    return 'last'
  }
}

export default Package
