import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()
const { readFile, writeFile } = require('fs').promises

const rFile = (fileName) => {
  return readFile(`${__dirname}/${fileName}.json`, { encoding: 'utf8' }).then((result) =>
    JSON.parse(result)
  )
}
const wFile = (fileName, data) => {
  return writeFile(`${__dirname}/${fileName}.json`, JSON.stringify(data), { encoding: 'utf8' })
}

const postLogs = async (req) => {
  const products = await rFile('data')
  const logs = await rFile('logs')
  let updetedLogs
  if (req.body.type === 'ADD_SELECTION') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `add ${products.find((el) => el.id === req.body.id).title} element to the basket`
      }
    ]
  }
  if (req.body.type === 'REMOVE_SELECTION') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `remove ${products.find((el) => el.id === req.body.id).title} element to the basket`
      }
    ]
  }
  if (req.body.type === 'EUR') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `checked  ${req.body.type} currency`
      }
    ]
  }
  if (req.body.type === 'CAD') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `checked  ${req.body.type} currency`
      }
    ]
  }
  if (req.body.type === 'USD') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `checked  ${req.body.type} currency`
      }
    ]
  }
  if (req.body.type === 'lowest') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `get sort ${req.body.type} price`
      }
    ]
  }
  if (req.body.type === 'highest') {
    updetedLogs = [
      ...logs,
      {
        time: new Date(),
        event: `get sort ${req.body.type} price`
      }
    ]
  }
  await wFile('logs', updetedLogs)
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/shop', async (req, res) => {
  const data = await rFile('data')
  res.json(data)
})

server.get('/api/v1/rates', async (req, res) => {
  const { data: rates } = await axios('https://api.exchangeratesapi.io/latest?symbols=USD,CAD')
  res.json(rates)
})

server.get('/api/v1/logs', async (req, res) => {
  const logs = await rFile('logs')
  res.json(logs)
})

server.post('/api/v1/logs', async (req, res) => {
  postLogs(req)
  res.json({ status: 'ok' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Boilerplate'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
