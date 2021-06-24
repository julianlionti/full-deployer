# Full-Deploy

Nodejs tool for deploying on unix servers

***

# Getting Started

```ts
npm i -D full-deployer
```

You will have to create a file called deployerrc.json in the root folder of your proyect


```ts
{
  "host": "string",
  "port": number, // OPTIONAL - Default 22
  "user": "string",
  "pass": "string",

  "destination": "string",
  "buildScript": "string", //OPTIONAL - Default 'build'
  "deployDir": "string", //OPTIONAL - Default 'build'
  "backupsDir": "string", // OPTIONAL - Default '__bk'

  "pm2proccessId": number //OPTIONAL for restaring PM2 proccesId
}
```

If you have git initialized it will create a new TAG from new version.
If no version changes, the bk will be created in noversion folder in destination

# Commandline options

```ts
full-deployer -y --no-tag --no-backup --no-build
```

if '-y' full-deployer will crete a backup
if '--no-tag' no tag will created when update version