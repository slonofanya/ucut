import fs from 'fs'
import _ from 'lodash'
import Mp3Cutter from 'mp3-cutter'

const dir = '../out'

const toSec = time => {
  if (!time) return 0;

  const a = time.split(':')
  return (+a[0]) * 60 + (+a[1])
}

export default ({ src, hash, timeCodes }) => {
  const target = `${dir}/${hash}`

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, 0o777)
  }

  return _(timeCodes)
    .map((time, i) => {
      const start = toSec(time.start)
      const end = toSec(time.end)

      if (!end) {
        return
      }

      const fileName = `${time.name || `${start}-${end}`}.mp3`;
      const targetFilePath = `${target}/${fileName}`;

      Mp3Cutter.cut({
        src,
        target: targetFilePath,
        start,
        end: end || 9999
      })

      return `${hash}/${fileName}`
    })
    .compact()
    .value()
}
