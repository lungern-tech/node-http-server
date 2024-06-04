#!/usr/bin/env node

import express from "express";
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from 'node:url';
import { publicIpv4 } from "public-ip";
import GetHostIP from "./utils/getIP.js";


const app = express()
app.set('view engine', 'ejs')

const root = process.cwd()
app.use(express.static(root, { dotfiles: "allow" }))
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views/'))

app.get('*', (req, res, next) => {
  let filePath = req.path
  let target =  path.join(root, filePath)
  let targetStat = fs.lstatSync(target)
  let last = filePath.split('/').filter(e => !!e).pop() || '/'
  if (targetStat.isDirectory()) {
    const arr = fs.readdirSync(target)
    let list = arr.map(e => {
      let stat = fs.statSync(path.join(target, e))
      return {
        name: e,
        isDirectory: stat.isDirectory(),
        modifiedTime: stat.mtime,
        size: stat.size,
      }
    })
    list.unshift({
      name: "..",
      isDirectory: true,
      modifiedTime: new Date(0),
      size: 0,
    })
    list.unshift({
      name: ".",
      isDirectory: true,
      modifiedTime: new Date(0),
      size: 0
    })
    
    fs.statSync(path.join(target, ))
    res.render('skeleton', {
      title: last,
      list
    })
    return
  } else if (targetStat.isFile()) {
    console.log('file: ', target)
    res.download(target)
  }
  next()
})


const port = 8080
app.listen(port, async () => {
  const internalIP = GetHostIP()
  const ip = await publicIpv4()
  console.log("server start at: ")
  console.log(`    http://${internalIP}:${port}`)
  console.log(`    http://${ip}:${port}`)
})

export default app