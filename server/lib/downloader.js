import fs from 'fs'
import YoutubeMp3Downloader from 'youtube-mp3-downloader'

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
  'ffmpegPath': '/usr/bin/ffmpeg',        // Where is the FFmpeg binary located?
  'outputPath': '../out',    // Where should the downloaded and encoded files be stored?
  'youtubeVideoQuality': 'highest',       // What video quality should be used?
  'queueParallelism': 12,                  // How many parallel downloads/encodes should be started?
  'progressTimeout': 8000                 // How long should be the interval of the progress reports
});

export default (hash, { videoFilePath, onProgress }) =>
  new Promise((resolve, reject) => {
    const out = `${videoFilePath}.mp3`

    if (fs.existsSync(out)) {
      return resolve(out)
    }

    YD.download(hash, `${hash}.mp3`)
    YD.on('finished', (err, data) => {
      if (err) return reject(err)
      resolve(out)
    })
    YD.on('error', reject)
    YD.on('progress', onProgress)
  })
