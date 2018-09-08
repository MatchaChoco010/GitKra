const exec = require('child_process').exec

const git = {
  getCurrentHash() {
    return new Promise((resolve, reject) => {
      exec('git rev-parse HEAD', (err, stdout, stderr) => {
        if (err) reject(err)
        resolve(stdout)
      })
    })
  },

  checkout(hash) {
    return new Promise((resolve, reject) => {
      exec(`git checkout ${hash}`, (err, stdout, stderr) => {
        if (err) reject(err)
        console.log(stdout)
        console.log(stderr)
        resolve()
      })
    })
  },

  checkoutParent() {
    return new Promise((resolve, reject) => {
      exec('git checkout HEAD^', (err, stdout, stderr) => {
        if (err) reject(err)
        console.log(stdout)
        console.log(stderr)
        resolve()
      })
    })
  }
}

module.exports = git
