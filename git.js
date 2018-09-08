const child_process = require('child_process')

const git = {
  getCurrentHash() {
    return new Promise((resolve, reject) => {
      child_process.exec('git rev-parse HEAD', (err, stdout, stderr) => {
        if (err) reject(err)
        resolve(stdout)
      })
    })
  },

  checkoutSync(hash) {
    child_process.execSync(`git checkout ${hash}`)
  },

  checkoutParentSync() {
    child_process.execSync('git checkout HEAD^')
  }
}

module.exports = git
