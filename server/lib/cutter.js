import Mp3Cutter from 'mp3-cutter'

const toSec = time => {
  if (!time) return 0;
  const a = time.split(':')
  return (+a[0]) * 60 + (+a[1])
}

export default ({ src, timeCodes }) =>
  timeCodes.map((time, i) => {
    const start = toSec(time)
    const end = toSec(timeCodes[i+1])

    return start && end && Mp3Cutter.cut({
      src,
      target: `${src}${start}-${end}.mp3`,
      start,
      end
    })
  })
