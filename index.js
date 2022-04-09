const express = require('express')
const app = express()
const fs = require('fs')

const file = process.argv.slice(2)[0].replace(/^\\\\\?\\/,"").replace(/\\/g,'\/').replace(/\/\/+/g,'\/')


app.get('/', (req,res) => {
 return res.sendFile(__dirname+'/index.html')
})

app.get('/video', (req,res) => {
    const range = req.headers.range
    if (!range) {
        return res.status(404).send("Require Range Header")
    }

    const videopath = file
    const videosize = fs.statSync(file).size 
    const CHUNK_SIZE = 10 ** 6
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videosize - 1)
    
    const content_length = end - start + 1
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videosize}`,
        'Accept-Ranges': 'bytes',
        'Content-length': content_length,
        'Content-Type' : 'video/mp4',
    }

    res.writeHead(206, headers)
    
    
    const videostream = fs.createReadStream(videopath, { start, end })
    //console.log(videostream)
    videostream.pipe(res)
})

app.listen(80, () => {
    console.log("Listening on 8080")
})