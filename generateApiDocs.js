const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

const routesDir = path.join(__dirname, 'src', 'routes')
const outFile = 'apiDoc.md'
const postmanFile = 'postman_collection.json'

const scriptStartTime = Date.now() // TTS start time

function genDocs(isUpdate = false) {

  const runStartTime = Date.now() // TTR start time

  fs.readdir(routesDir, (err, files) => {
    if (err) {
      console.error('could not read routes dir', err)
      return;
    }

    console.log("Route files scanned:", files.length)

    let docs = '## API Documentation\n\n'
    let methodStats = { GET: 0, POST: 0, PUT: 0, DELETE: 0 }
    let postmanItems = []

    let pending = files.length
    if (!pending) return createFile(docs, methodStats, runStartTime, isUpdate, postmanItems)

    files.forEach(f => {
      const filePath = path.join(routesDir, f)

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (!err) {
          let desc = ''
          let query = []
          let body = []
          let header = []

          const lines = data.split('\n')

          lines.forEach(line => {
            const l = line.trim()

            if (l.startsWith('// @api')) {
              desc = l.replace('// @api', '').trim()
            }

            if (l.startsWith('// @query')) {
              query = l.replace('// @query', '').split(',').map(p => p.trim())
            }

            if (l.startsWith('// @body')) {
              body = l.replace('// @body', '').split(',').map(p => p.trim())
            }

            if (l.startsWith('// @header')) {
              header = l.replace('// @header', '').split(',').map(p => p.trim())
            }

            if (l.startsWith('router.')) {
              const m = l.match(/router\.(\w+)\(/)
              const r = l.match(/\(['"`](.*?)['"`]/)
              const args = l.match(/\((.*)\)/)

              if (m && r && args) {
                const method = m[1].toUpperCase()
                const route = r[1]

                if (methodStats[method] !== undefined) {
                  methodStats[method]++
                }

                const parts = args[1].split(',').map(p => p.trim())
                const middlewares = parts.length > 2 ? parts.slice(1, parts.length - 1).filter(mw => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(mw)) : []

                const authRequired = middlewares.some(mw =>
                  mw.toLowerCase().includes('auth') ||
                  mw.toLowerCase().includes('jwt') ||
                  mw.toLowerCase().includes('token')
                )

                docs += `### [${method}] ${route}\n`
                docs += `Description: ${desc || '-'}\n`

                if (middlewares.length > 0) {
                  docs += `Middleware:\n`
                  middlewares.forEach(mw => docs += `- ${mw}\n`)
                }

                if (query.length > 0) {
                  docs += `Query Params:\n`
                  query.forEach(p => docs += `- ${p}\n`)
                }

                if (body.length > 0) {
                  docs += `Body Params:\n`
                  body.forEach(p => docs += `- ${p}\n`)
                }

                if (header.length > 0) {
                  docs += `Header Params:\n`
                  header.forEach(p => docs += `- ${p}\n`)
                }

                if (authRequired) {
                  docs += `Security:\n- Authorization Token Required\n`
                }

                docs += '\n'

                const postmanReq = {
                  name: `${method} ${route}`,
                  request: {
                    method,
                    header: [],
                    url: {
                      raw: `{{baseUrl}}${route}`,
                      host: ['{{baseUrl}}'],
                      path: route.split('/').filter(Boolean)
                    }
                  }
                }

                if (authRequired) {
                  postmanReq.request.header.push({
                    key: 'Authorization',
                    value: 'Bearer {{token}}'
                  })
                }

                if ((method === 'POST' || method === 'PUT') && body.length > 0) {
                  const bodyObj = {}
                  body.forEach(b => bodyObj[b] = "")

                  postmanReq.request.body = {
                    mode: 'raw',
                    raw: JSON.stringify(bodyObj, null, 2),
                    options: { raw: { language: 'json' } }
                  }
                }

                postmanItems.push(postmanReq)

                desc = ''
                query = []
                body = []
                header = []
              }
            }
          })
        }

        if (!--pending) {
          createFile(docs, methodStats, runStartTime, isUpdate, postmanItems)
        }
      })
    })
  })
}

function createFile(doc, stats, runStartTime, isUpdate, postmanItems) {
  let total = Object.values(stats).reduce((a, b) => a + b, 0)

  doc += '\n-------------------------------\n'
  doc += '## API Summary\n\n'
  doc += `**Total Endpoints:** ${total}\n\n`

  Object.entries(stats).forEach(([m, c]) => {
    if (c) doc += `- **${m}:** ${c}\n`
  })

  fs.writeFile(outFile, doc, () => {
    const endTime = Date.now()
    const ttr = endTime - runStartTime

    console.log("Total endpoints detected:", total)

    if (isUpdate) {
      console.log("Incremental Update Time (TTR):", ttr, "ms")
    } else {
      const totalTime = endTime - scriptStartTime
      const tts = totalTime - ttr
      console.log("Time to Start (TTS):", tts, "ms")
      console.log("Time to Run (TTR):", ttr, "ms")
      console.log("Total Time:", totalTime, "ms")
    }
  })

  const postmanCollection = {
    info: {
      name: 'Study Planner APIs',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: postmanItems
  }

  fs.writeFile(postmanFile, JSON.stringify(postmanCollection, null, 2), () => {})
}

genDocs(false)

chokidar.watch(routesDir).on('change', f => {
  console.log('changed:', f)
  genDocs(true)
})









