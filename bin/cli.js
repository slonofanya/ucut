#!/usr/bin/env node

import yargs from 'yargs'
import downloader from './downloader.js'
import Mp3Cutter from 'mp3-cutter'
import fs from 'fs'

const { _ } = yargs.parse()
const [ hash, ...timeArgs ] = _
console.log({ hash, timeArgs })

const videoFilePath = `./out/${hash}`;
const target = `/mnt/c/mp3/${hash}`;

const toSec = time => {
  if (!time) return 0;
  const a = time.split(':')
  return (+a[0]) * 60 + (+a[1])
}

(async () => {
  const data = await new Promise((resolve, reject) => {
    if (fs.existsSync(videoFilePath)) {
      return resolve('File is already downloaded')
    }

    const YD = downloader()
    YD.download(hash, hash)

    YD.on('finished', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })

    YD.on('error', (error) => {
      console.log(error)
    })

    YD.on('progress', (progress) => {
      console.log(JSON.stringify(progress))
    })
  })

  console.log({ data })
  console.log('====================================================================================================')
  const seconds = timeArgs.reduce((result, time, i) => {
    const start = toSec(time)
    const end = toSec(timeArgs[i+1])
    return [
      ...result,
      end && { start, end }
    ]
  }, [])
  console.log({ seconds });

  const audios = await seconds.map(({ start, end }) => start && end &&
    Mp3Cutter.cut({
      src: videoFilePath,
      target: `${target}${start}-${end}.mp3`,
      start,
      end
    })
  )

  console.log({ audios })
})()

