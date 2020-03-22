import express from 'express'
import cors from 'cors'

import downloader from './lib/downloader.js';
import cutter from './lib/cutter.js';
import { youtubeParse } from './lib/utils.js';

const app = express()
app.use(cors())
const port = 3001

app.get('/', async (req, res) => {
  const { url, start, end } = req.query
  const hash = youtubeParse(url);
  const videoFilePath = `./out/${hash}`;

  const downloaded = await downloader(hash, {
    videoFilePath,
    onProgress: progress => {
      console.log('====================================================================================================');
      console.log(progress)
    }
  });

  const cutted = await cutter({
    src: videoFilePath,
    timeCodes: [start, end]
  })

  res.send({ url, start, end })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

