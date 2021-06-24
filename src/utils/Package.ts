import {execSync} from 'child_process'
import fs from 'fs'
import path from 'path'
import Console from './Console'
import {prompt} from './Misc'

interface PackageProps {
  version: string
}

const changeVersion = async (noTag: boolean) => {
  const pkgPath = path.resolve('./package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath).toString()) as PackageProps
  Console.info(
    'Before deploying, do you want to update de package.json version? If not, the backup generated will not be versioned',
  )
  Console.info(`Last version is: ${pkg.version}`)
  const nextVersion = await prompt<string>('Next version (Leave it empty if not): ')

  if (nextVersion !== '' && nextVersion !== pkg.version) {
    Console.start('Modifyng package.json...')
    try {
      execSync(`npm ${noTag ? '--no-git-tag-version' : ''} version ${nextVersion}`)
      if (!noTag) {
        Console.warn(
          'Git tagged for this version has been created. To push tags you can  ',
        )
        Console.warn(`git push origin v${nextVersion} `)
        Console.warn(`or push all tags (not recommended)  `)
        Console.warn(`git push --tags `)
      }
    } catch (ex) {
      Console.error(
        'Cannot upload version',
        ex.message.includes('Git working directory not clean')
          ? 'Git must be commited'
          : '',
      )
    }
    Console.end('package.json modified succesfully')
    return pkg.version //
  }

  return 'noversion'
}

export default {changeVersion}
