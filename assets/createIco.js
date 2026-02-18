const fs = require('fs')
const { default: pngToIco } = require('png-to-ico')

pngToIco([
  './assets/icon-16.png',
  './assets/icon-32.png',
  './assets/icon-48.png',
  './assets/icon-256.png'
]).then(buf => {
  fs.writeFileSync('./assets/icon.ico', buf)
})