const express = require('express')
const multer  = require('multer')
const sharp = require('sharp')
const path = require('path');

const fs = require('fs')
//const upload = multer({ dest: '/uploads' })
const app = express()



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     const img = cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/home.html')
})

app.post('/', upload.single('uploaded_image'), function(req, res) {
    let inputPath = req.file.path
    let outputPath = path.join('uploads', `compressed_${req.file.originalname}`)
    let quality = 80

    console.log('Input Path:', inputPath)

    async function convert(inputPath, outputPath, quality) {
        try {
            await sharp(inputPath)
                .resize(800)
                .jpeg({ quality: quality }) 
                .toFile(outputPath);
            console.log('Image compressed successfully')
            res.download(outputPath); // Send the compressed image as a download
        } catch (error) {
            console.error('Error compressing image:', error)
            res.status(500).send('Error compressing image')
        }
    }

    convert(inputPath, outputPath, quality)
})

app.listen(3000)
