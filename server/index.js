import _ from 'lodash'
import express from 'express'
import cors from 'cors'

import downloader from './lib/downloader.js';
import cutter from './lib/cutter.js';
import { youtubeParse } from './lib/utils.js';

const app = express()
app.use(cors())
const port = process.env.PORT || 3001
const dir = '../out'
app.use(express.static(dir))

app.get('/', async (req, res) => {
  const url = JSON.parse(req.query.url)
  const timeCodes = JSON.parse(req.query.timeCodes)
  const hash = youtubeParse(url);
  const videoFilePath = `${dir}/${hash}`;

  const src = await downloader(hash, {
    videoFilePath,
    onProgress: (progress) => {
      res.write(JSON.stringify(progress))
    }
  });

  const cuts = cutter({ src, timeCodes, hash })

  res.end(JSON.stringify({ cuts }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

