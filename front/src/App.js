import _ from 'lodash';
import React, { useState } from 'react';
import './App.css';

// const defaultUrl = 'https://www.youtube.com/watch?v=3EP-duJ9vsI';
const defaultUrl = 'https://www.youtube.com/watch?v=1QewPifmFxI';
const defaultTimeCodes = [{
  start: '0:0',
  end: '0:15'
}]

const {
  protocol,
  hostname
} = document.location
const baseUrl = `${protocol}//${hostname}:3001`

const onClick = async (params, { onProgress }) => {
  var url = new URL('/', baseUrl)

  _.forEach(params, (value, key) =>
    url.searchParams.append(key, JSON.stringify(value))
  )

  const { body } = await fetch(url)
  const reader = body.getReader()

  new ReadableStream({
    start(controller) {
      return pump();
      function pump() {
        return reader.read().then(({ done, value }) => {
          var string = new TextDecoder('utf-8').decode(value)

          if (done) return

          onProgress(JSON.parse(string))
          return pump();
        });
      }
    }
  })
}

export default () => {
  const [cuts, setCuts] = useState([])
  const [percentage, setPersetage] = useState(0)
  const [timeCodes, setTimeCodes] = useState(defaultTimeCodes)
  const [url, setUrl] = useState(defaultUrl);

  const onChangeTime = (i, key) => e => {
    const newTimecodes = [ ...timeCodes ]
    _.set(newTimecodes, `${i}.${key}`, e.target.value)
    setTimeCodes(newTimecodes)
  }

  const onProgress = progressData => {
    const { progress = {} } = progressData;
    setPersetage(progress.percentage || 0)
    setCuts(progressData.cuts)
  }

  return (
    <div className='App'>
      <header className='App-header'>Header</header>

      <div>
        Url:
        <input
          onChange={ e => setUrl(e.target.value) }
          value={ url }
        />
      </div>

      { _.map(timeCodes, ({ start, end }, i) => (
        <div key={ i }>
          <div>
            Start:
            <input
              onChange={ onChangeTime(i, 'start') }
              value={ start }
            />
          </div>

          <div>
            End:
            <input
              onChange={ onChangeTime(i, 'end') }
              value={ end }
            />
          </div>
        </div>
      )) }
      <button onClick={ () => setTimeCodes([ ...timeCodes, {} ]) }>Add</button>

      <button onClick={ () => {
        setPersetage(0)
        onClick({ url, timeCodes }, { onProgress })
      } }>Go</button>

      <hr />

      <div
        className='progress'
        style={ { width: `${percentage}%` } }
      />

      { _.map(cuts, cut => (
        <a
          key={ cut }
          className='cuts'
          href={ `${baseUrl}/${cut}` }
          target='noopener noreferrer'
        >
          { cut }
        </a>
      )) }
    </div>
  );
}
