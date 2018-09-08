const yauzl = require('yauzl')
const fs = require('fs')

module.exports = {
  kra2png(krafile, outfile) {
    return new Promise((resolve, reject) => {
      yauzl.open(krafile, { lazyEntries: true }, (err, zipfile) => {
        if (err) reject(err)

        zipfile.readEntry()
        zipfile.on('entry', entry => {
          if (entry.fileName !== 'mergedimage.png') {
            zipfile.readEntry()
            return
          }

          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) reject(err)

            const writeStream = fs.createWriteStream(outfile)
            writeStream.on('close', () => {
              console.log(`Write ${outfile}`)
              resolve()
            })
            readStream.pipe(writeStream)
          })
        })
      })
    })
  }
}
