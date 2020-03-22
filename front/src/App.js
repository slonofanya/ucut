import _ from 'lodash';
import React, { useState } from 'react';
import './App.css';

const url = 'https://www.youtube.com/watch?v=3EP-duJ9vsI';
const start = '9:44'
const end = '15:32'

const {
  protocol,
  hostname
} = document.location
const baseUrl = `${protocol}//${hostname}:3001`

const onClick = async (params) => {
  var url = new URL('/', baseUrl)

  console.log({ params, url });
  _.forEach(params, (value, key) =>
    url.searchParams.append(key, value)
  )

  const data = await fetch(url).then(data => data.json())
  console.log({ data });
}

export default () => {
  const [params, setParams] = useState({
    url,
    start,
    end
  });
  const onChange = key => e => {
    setParams({
      ...params,
      [key]: e.target.value
    })
  }

  return (
    <div className='App'>
      <header className='App-header'>Header</header>

      <div>
        Url:
        <input
          onChange={ onChange('url') }
          value={ params.url }
        />
      </div>

      <div>
        Start:
        <input
          onChange={ onChange('start') }
          value={ params.start }
        />
      </div>

      <div>
        End:
        <input
          onChange={ onChange('end') }
          value={ params.end }
        />
      </div>

      <button onClick={ () => onClick(params) }>Go</button>
    </div>
  );
}
