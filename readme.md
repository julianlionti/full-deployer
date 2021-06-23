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
    destination: "string", //full deploy path
    deployDir: "string", //OPTIONAL dir to deploy - Default build
    backupsDir: "string", ////OPTIONAL bk dir name in server - Default __bk

    host: "string",
    user: "string",
    pass: "string",
    port: number, //OPTIONAL - Default 22
}
```


