#!/usr/bin/env node

const program = require('commander')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')
const git = require('./git.js')
const kra2png = require('./kra2png').kra2png

async function main() {
  program
    .version('1.0.0')
    .option('-r, --repository-path <path>', 'Repository path')
    .option('-o, --out-dir <dir>', 'Output directory')
    .option('-f, --filename <filename>', '.kra filename (default: illust.kra)')
    .parse(process.argv)

  const repositoryPath = program.repositoryPath
  const outDir = path.normalize(path.join(process.cwd(), program.outDir))
  const filename = program.filename || 'illust.kra'

  if (repositoryPath === undefined) {
    console.warn('-r is required')
    return
  }

  if (outDir === undefined) {
    console.warn('-o is required')
    return
  }

  console.log('### GitKra ###')
  console.log(`\trepo       : ${repositoryPath}`)
  console.log(`\toutput dir : ${outDir}`)
  console.log(`\t.kra file  : ${filename}`)

  mkdirp.sync(outDir)

  process.chdir(repositoryPath)

  const currentHash = await git.getCurrentHash()

  console.log(`\nCurrent Hash: ${currentHash}\n`)

  process.on('SIGINT', () => {
    console.log('Caught interrupt signal')
    git.checkoutSync(currentHash)
    process.exit()
  })

  let i = 0

  try {
    while (true) {
      await kra2png(filename, `${outDir}/tmp${i}.png`)

      i++

      git.checkoutParentSync()
    }
  } catch {
    git.checkoutSync(currentHash)
  }

  for (let n = 0; n < i; n++) {
    fs.rename(`${outDir}/tmp${n}.png`, `${outDir}${i - n - 1}.png`, err => {
      if (err) throw err
    })
  }
}

main()
