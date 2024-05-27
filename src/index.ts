import express from "express"
import path from "path"
import fs from "fs"
const app = express()
app.set('view engine', 'ejs')

const root = process.cwd()
app.use(express.static(root, { dotfiles: "allow" }))
app.set('views', path.join(__dirname, 'views/'))

app.get('*', (req, res, next) => {
  let filePath = req.path
  console.log(req.path)
  let target =  path.join(root, filePath)
  let targetStat = fs.lstatSync(target)
  let last = filePath.split('/').filter(e => !!e).pop() || '/'
  if (targetStat.isDirectory()) {
    const arr = fs.readdirSync(target)
    console.log(arr)
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
app.listen(port, () => {
  console.log('example app listening on port', port)
})