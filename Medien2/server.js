const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/video', function (req, res) {
    res.sendFile(path.join(__dirname + '/video.htm'))
})

app.get('/music', function (req, res) {
    res.sendFile(path.join(__dirname + '/music.html'))
})

app.get('/pdf', function (req, res) {
    res.sendFile(path.join(__dirname + '/pdf.html'))
})

app.get('/image/:name', function (req, res) {
    const path = 'assets/' + req.params.name
    const file = fs.createReadStream(path)
    res.writeHead(200, { 'Content-type': 'image/png' })
    file.pipe(res)
})

app.get('/document', function (req, res) {
    const path = 'assets/document.pdf'
    const file = fs.createReadStream(path)
    res.writeHead(200, { 'Content-type': 'application/pdf' })
    file.pipe(res)
})

app.get('/playVideo', function(req, res) {
  const path = 'assets/videoSample.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    console.log('range bekannt')
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    console.log('range unbekannt')
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.get('/playMusic', function (req, res) {
    const path = 'assets/musicSample.mp3'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        console.log('range bekannt')
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1

        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        console.log('range unbekannt')
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})