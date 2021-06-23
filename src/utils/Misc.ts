import {execSync} from 'child_process'
import {exit} from 'process'
import {ConfigProps} from './Configuration'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import Console from './Console'

export const buildProyect = (config: ConfigProps) => {
  Console.start('Execute: npm run build')
  Console.start('Building last version...')

  try {
    execSync(`npm run ${config.buildScript}`)
    Console.end('Proyect builded successfully')
  } catch (ex) {
    Console.error('Error building proyect', '')
  }
}

export type YesNoQuestion = 'Y' | 'N'

export const prompt = <T extends string>(question: string): Promise<T> =>
  new Promise((res) => {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})
    rl.question(`${question} `, (answer) => {
      res(answer.toUpperCase() as T)
      rl.close()
    })
  })

export const sleep = (timeout?: number) => {
  return new Promise((res) => setTimeout(res, timeout || 2000))
}

export const countFiles = (dir: string): number => {
  const readFiles = (directory: string): string[] =>
    fs.statSync(directory).isDirectory()
      ? Array.prototype.concat(
          ...fs.readdirSync(directory).map((f) => readFiles(path.join(directory, f))),
        )
      : [directory]

  const files = readFiles(dir)
  return files.length
}
